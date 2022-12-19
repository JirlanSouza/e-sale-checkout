import { Logger } from "@nestjs/common";
import { ClientRMQ, ReadPacket, RmqRecord } from "@nestjs/microservices";
import { ChannelWrapper, Options } from "amqp-connection-manager";
import { RmqOptions } from "../rmq/RmqOptions";

interface RmqClientOptions extends RmqOptions {
    exchange?: {
        name: string;
        type: "direct" | "fanout" | "topic" | "headers";
        bindQueues?: string[];
        options?: Options.AssertExchange;
    };
}

export class RmqClient extends ClientRMQ {
    channel: ChannelWrapper;

    constructor(readonly options: RmqClientOptions) {
        super(options);
    }

    async connect() {
        const superConnectResponse = await super.connect();
        await this.assertExchange();
        return superConnectResponse;
    }

    private async assertExchange() {
        if (!this.options.exchange) return;
        const { name, type, options } = this.options.exchange;
        await this.channel.assertExchange(name, type, options ?? {});
        Logger.log(`Assert the Exchange : ${name}`, RmqClient.name);
        await this.bindQueues();
    }

    private async bindQueues() {
        if (!this.options?.exchange?.bindQueues) return;
        for (const queue of this.options.exchange.bindQueues) {
            await this.channel.assertQueue(queue);
            await this.channel.bindQueue(queue, this.options.exchange.name, "");
            Logger.log(
                `Bind the Queue: ${queue} in ${this.options.exchange.name} Exchange`,
                RmqClient.name,
            );
        }
    }

    protected dispatchEvent(packet: ReadPacket): Promise<any> {
        const serializedPacket: ReadPacket & Partial<RmqRecord> =
            this.serializer.serialize(packet.data);

        const options = serializedPacket.options;
        delete serializedPacket.options;

        return new Promise<void>((resolve, reject) => {
            const callback = (err: unknown) => (err ? reject(err) : resolve());
            if (this.options.exchange) {
                this.publishToExchange(serializedPacket, options, callback);
            } else {
                this.sendToQueue(serializedPacket, options, callback);
            }
        });
    }

    private async publishToExchange(data, options, callback) {
        this.channel.publish(
            this.options.exchange.name,
            "",
            Buffer.from(JSON.stringify(data)),
            {
                persistent: this.persistent,
                ...options,
                headers: this.mergeHeaders(options?.headers),
            },
            callback,
        );
    }

    private async sendToQueue(data, options, callback) {
        return this.channel.sendToQueue(
            this.queue,
            Buffer.from(JSON.stringify(data)),
            {
                persistent: this.persistent,
                ...options,
                headers: this.mergeHeaders(options?.headers),
            },
            callback,
        );
    }
}
