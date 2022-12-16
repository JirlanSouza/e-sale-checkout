import { Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PlaceOrderQueue } from "src/application/adapter/PlaceOrderQueue";
import { PlaceOrderComand } from "src/application/comands/placeOrder";

export class PlaceOrderRmqQueueAdapter implements PlaceOrderQueue {
    constructor(private readonly clientProxy: ClientProxy) {}

    async publish(event: PlaceOrderComand): Promise<void> {
        this.clientProxy.emit(event.name, event);
        Logger.log(
            `Publish the new event in topic: ${event.name}`,
            PlaceOrderRmqQueueAdapter.name,
        );
    }
}
