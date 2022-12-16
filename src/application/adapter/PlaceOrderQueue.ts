import { PlaceOrderComand } from "../comands/placeOrder";

export interface PlaceOrderQueue {
    publish(event: PlaceOrderComand): Promise<void>;
}

export const PlaceOrderQueue = Symbol("PlaceOrderQueue");
