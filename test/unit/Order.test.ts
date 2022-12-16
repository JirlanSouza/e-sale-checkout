import { Coupon } from "src/domain/entity/Coupon";
import { Item } from "src/domain/entity/Item";
import { Dimension } from "src/domain/valueObject/Dimension";

import { Order } from "src/domain/entity/Order";

describe("Order", () => {
    test("Should be able create a order with valid cpf", () => {
        expect(() => new Order("111.111.111-00", 1)).toThrow(
            new Error("Cpf inválido"),
        );
    });

    test("Should be able able create a order with 3 items", () => {
        const order = new Order("259.556.978-37", 1);
        order.addItem(new Item("1", "Guitarra", 1000), 1);
        order.addItem(new Item("2", "Amplificador", 5000), 1);
        order.addItem(new Item("3", "Cabo", 100), 1);
        const total = order.getTotal();
        expect(total).toBe(6100);
    });

    test("Should be able create a order with 3 items and 1 discount coupon", () => {
        const order = new Order("259.556.978-37", 1);
        order.addItem(new Item("1", "Guitarra", 1000), 1);
        order.addItem(new Item("2", "Amplificador", 5000), 1);
        order.addItem(new Item("3", "Cabo", 100), 1);
        order.addCoupon(new Coupon("VALE10", 10));
        const total = order.getTotal();
        expect(total).toBe(5490);
    });

    test("Should not be added duplicate item", () => {
        const order = new Order("259.556.978-37", 1);
        const item = new Item("1", "Guitarra", 1000);
        order.addItem(item, 1);

        expect(() => order.addItem(item, 1)).toThrow(
            new Error("Duplicated item"),
        );
    });

    test("Should not be applicable discount on expired coupon", () => {
        const order = new Order(
            "259.556.978-37",
            1,
            new Date("2022-12-02T23:59:59.999"),
        );
        order.addItem(new Item("1", "Guitarra", 1000), 1);
        order.addItem(new Item("2", "Amplificador", 5000), 1);
        order.addItem(new Item("3", "Cabo", 100), 1);
        order.addCoupon(
            new Coupon("VALE10", 10, new Date("2022-12-01T23:59:59.999")),
        );
        const total = order.getTotal();
        expect(total).toBe(6100);
    });

    test("Should be applicable discount on not expired coupon", () => {
        const order = new Order(
            "259.556.978-37",
            1,
            new Date("2022-12-01T23:59:59.999"),
        );
        order.addItem(new Item("1", "Guitarra", 1000), 1);
        order.addItem(new Item("2", "Amplificador", 5000), 1);
        order.addItem(new Item("3", "Cabo", 100), 1);
        order.addCoupon(
            new Coupon("VALE10", 10, new Date("2022-12-02T23:59:59.999")),
        );
        const total = order.getTotal();
        expect(total).toBe(5490);
    });

    test("Should be able able create a order with code", () => {
        const order = new Order(
            "259.556.978-37",
            1,
            new Date("2022-12-01T00:00:00.000"),
        );
        order.addItem(
            new Item("1", "Guitarra", 1000, new Dimension(100, 30, 10, 3)),
            1,
        );
        expect(order.code).toBe("202200000001");
    });
});
