import { Order } from "../entity/Order";

export class OrderPlacedEvent {
    readonly name = "placedOrder";

    constructor(readonly order: Order) {}
}
