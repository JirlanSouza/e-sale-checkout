import { Logger } from "@nestjs/common";
import { ServerRMQ } from "@nestjs/microservices";
import { ChannelWrapper } from "amqp-connection-manager";
import { RmqOptions } from "../rmq/RmqOptions";

interface RmqServerOptions extends RmqOptions {
    bindExchange?: string;
}

export class RmqServer extends ServerRMQ {
    private notFoundExchage = false;

    constructor(readonly options: RmqServerOptions) {
        super(options);
    }

    async setupChannel(channel: ChannelWrapper, callback: Function) {
        await super.setupChannel(channel, callback);
        if (!this.options.bindExchange || this.notFoundExchage) return;

        try {
            await channel.bindQueue(
                this.options.queue,
                this.options.bindExchange,
                "",
            );
        } catch (err) {
            Logger.warn(err.message, RmqServer.name);
            this.notFoundExchage = true;
        }
    }
}
