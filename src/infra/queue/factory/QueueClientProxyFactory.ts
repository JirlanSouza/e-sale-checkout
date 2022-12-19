import { ClientsModule } from "@nestjs/microservices";
import { RmqClient } from "../client/RmqClient";

export class QueueClientProxyFactory {
    static orderPlaceQueueClientProxy = Symbol("OrderPlaceQueueClientProxy");
    static placeOrderQueueClientProxy = Symbol("PlaceOrderQueueClientProxy");

    static create() {
        return ClientsModule.register([
            {
                name: QueueClientProxyFactory.placeOrderQueueClientProxy,
                customClass: RmqClient,
                options: {
                    urls: ["amqp://localhost"],
                    queue: "placeOrder",
                },
            },
            {
                name: QueueClientProxyFactory.orderPlaceQueueClientProxy,
                customClass: RmqClient,
                options: {
                    exchange: {
                        name: "checkout",
                        type: "fanout",
                        bindQueues: ["orderPlaced"],
                    },
                    urls: ["amqp://localhost"],
                },
            },
        ]);
    }
}
