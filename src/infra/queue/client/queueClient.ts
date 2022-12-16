import {
    ClientOptions,
    ClientProxyFactory,
    Transport,
} from "@nestjs/microservices";

export class QueueClientRegister {
    static options: ClientOptions = {
        transport: Transport.RMQ,
        options: {
            urls: ["amqp://localhost"],
            queue: "placeOrder",
        },
    };

    static register() {
        return {
            useFactory: () => {
                return ClientProxyFactory.create(QueueClientRegister.options);
            },
        };
    }
}
