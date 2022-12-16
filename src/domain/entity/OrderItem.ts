export class OrderItem {
    constructor(
        readonly idItem: string,
        readonly price: number,
        readonly quantity: number,
    ) {
        if (quantity < 1) throw new Error("Invalid item quantity");
    }

    getTotal() {
        return this.price * this.quantity;
    }
}
