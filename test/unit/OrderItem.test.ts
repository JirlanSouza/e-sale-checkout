import { OrderItem } from "src/domain/entity/OrderItem";

describe("Orderitem", () => {
    test("Should be able create oreder item", () => {
        const orderItem = new OrderItem("1", 1200, 2);
        expect(orderItem.getTotal()).toBe(2400);
    });

    test("Should not be able create order item with negative quantity", () => {
        expect(() => new OrderItem("1", 1200, -1)).toThrow(
            new Error("Invalid item quantity"),
        );
    });
});
