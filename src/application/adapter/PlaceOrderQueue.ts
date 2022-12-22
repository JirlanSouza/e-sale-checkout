import { PlaceOrderComand } from "../comands/placeOrder";

export interface PlaceOrderQueue {
    publish(event: PlaceOrderComand): Promise<boolean>;
}

export const PlaceOrderQueue = Symbol("PlaceOrderQueue");
