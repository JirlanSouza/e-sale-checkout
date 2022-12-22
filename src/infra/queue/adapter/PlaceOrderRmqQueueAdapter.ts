import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { PlaceOrderQueue } from "src/application/adapter/PlaceOrderQueue";
import { PlaceOrderComand } from "src/application/comands/placeOrder";

export class PlaceOrderRmqQueueAdapter implements PlaceOrderQueue {
    constructor(private readonly clientProxy: ClientProxy) {}

    async publish(event: PlaceOrderComand): Promise<boolean> {
        const emitObserver = this.clientProxy.emit(event.name, event);
        const emitResult = await lastValueFrom(emitObserver);
        return emitResult;
    }
}
