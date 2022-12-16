import { Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { OrderPlacedQueue } from "src/application/adapter/OrderPlacedQueue";
import { OrderPlacedEvent } from "src/domain/event/OrderPlacedEvent";

export class OrderPlacedRmqQueueAdapter implements OrderPlacedQueue {
    constructor(private readonly clientProxy: ClientProxy) {}

    async publish(event: OrderPlacedEvent): Promise<void> {
        this.clientProxy.emit(event.name, event);
        Logger.log(
            `Publish the new event in topic: ${event.name}`,
            OrderPlacedRmqQueueAdapter.name,
        );
    }
}
