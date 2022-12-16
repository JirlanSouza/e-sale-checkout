import { Coupon } from "src/domain/entity/Coupon";

describe("Coupon", () => {
    test("Should be able create coupon", () => {
        const coupon = new Coupon("VALE10", 10);
        expect(coupon.calculateDiscount(100)).toBe(10);
    });

    test("Should not be able create coupon with negative percentage", () => {
        expect(() => new Coupon("VALE10", -10)).toThrow(
            new Error("Invalid coupon percentage"),
        );
    });

    test("Should not be applicable discount on expired coupon", () => {
        const coupon = new Coupon(
            "VALE10",
            10,
            new Date("2022-12-01T23:59:59.999"),
        );
        expect(
            coupon.calculateDiscount(100, new Date("2022-12-02T23:59:59.999")),
        ).toBe(0);
    });
});
