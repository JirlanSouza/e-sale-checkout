import { OrderCode } from "src/domain/valueObject/OrderCode";

describe("OrderCode", () => {
    test("Should be able create order code", () => {
        const orderCode = new OrderCode(1, new Date("2022-12-01t00:00:00.000"));
        expect(orderCode.value).toBe("202200000001");
    });
});
