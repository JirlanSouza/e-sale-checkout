import { OrderPlacedEvent } from "src/domain/event/OrderPlacedEvent";

export interface OrderPlacedQueue {
    publish(event: OrderPlacedEvent): Promise<void>;
}

export const OrderPlacedQueue = Symbol("OrderPlacedQueue");
