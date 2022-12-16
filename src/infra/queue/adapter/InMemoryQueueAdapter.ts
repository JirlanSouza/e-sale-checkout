import { Injectable } from "@nestjs/common";
import { OrderPlacedQueue } from "src/application/adapter/OrderPlacedQueue";
import { OrderPlacedEvent } from "src/domain/event/OrderPlacedEvent";

@Injectable()
export class InMemoryOrderPlacedQueueAdapter implements OrderPlacedQueue {
    private consumers: Map<string, Function[]>;

    constructor() {
        this.consumers = new Map();
    }

    async publish(event: OrderPlacedEvent): Promise<void> {
        const consumers = this.consumers.get(event.name) ?? [];
        for (const consume of consumers) {
            consume(event);
        }
    }

    async consume(topic: string, callback: Function): Promise<void> {
        if (this.consumers.has(topic)) {
            this.consumers.set(topic, [...this.consumers.get(topic), callback]);
            return;
        }
        this.consumers.set(topic, [callback]);
    }
}
