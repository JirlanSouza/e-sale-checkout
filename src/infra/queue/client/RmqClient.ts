import { ClientRMQ, ReadPacket, RmqRecord } from "@nestjs/microservices";
import { ChannelWrapper } from "amqp-connection-manager";
import { RmqClientOptions } from "./ClientOptions";

interface ClientOptions extends RmqClientOptions {
    exchange: string;
}

export class RmqClient extends ClientRMQ {
    private exchange: string;
    channel: ChannelWrapper;

    constructor(options: ClientOptions) {
        super(options);
        this.exchange = options.exchange;
    }

    protected dispatchEvent(packet: ReadPacket): Promise<any> {
        console.log("DISPACHT: ", this.exchange);

        const serializedPacket: ReadPacket & Partial<RmqRecord> =
            this.serializer.serialize(packet.data);

        const options = serializedPacket.options;
        delete serializedPacket.options;

        return new Promise<void>((resolve, reject) =>
            this.channel.publish(
                this.exchange,
                "",
                Buffer.from(JSON.stringify(serializedPacket)),
                {
                    persistent: this.persistent,
                    ...options,
                    headers: this.mergeHeaders(options?.headers),
                },
                (err: unknown) => (err ? reject(err) : resolve()),
            ),
        );
    }
}
