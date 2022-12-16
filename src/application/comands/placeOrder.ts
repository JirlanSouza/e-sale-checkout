export class PlaceOrderComand {
    readonly name = "placeOrder";

    constructor(
        readonly cpf: string,
        readonly items: { idItem: string; quantity: number }[],
        readonly coupon?: string,
    ) {
        if (!cpf || !items) {
            throw new Error("Invalid placeOrderComand arguments");
        }
    }
}
