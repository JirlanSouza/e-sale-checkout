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
                    exchange: "checkout",
                    urls: ["amqp://localhost"],
                    queue: "placeOrder",
                },
            },
            {
                //transport: Transport.RMQ,
                name: QueueClientProxyFactory.orderPlaceQueueClientProxy,
                customClass: RmqClient,
                options: {
                    exchange: "checkout",
                    urls: ["amqp://localhost"],
                    queue: "orderPlaced",
                },
            },
        ]);
    }
}
