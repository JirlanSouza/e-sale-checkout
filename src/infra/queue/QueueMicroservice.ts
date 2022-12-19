import { INestApplication } from "@nestjs/common";
import { RmqServer } from "./server/RmqServer";

export class QueueMicroservices {
    static setup(app: INestApplication) {
        for (const microserviceOptions of QueueMicroservices.options) {
            app.connectMicroservice(microserviceOptions);
        }
    }

    static options = [
        {
            strategy: new RmqServer({
                urls: ["amqp://localhost"],
                queue: "placeOrder",
                bindExchange: "order",
            }),
        },
    ];
}
