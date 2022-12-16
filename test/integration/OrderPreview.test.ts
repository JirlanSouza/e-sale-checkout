import { CalculatefreightGatway } from "src/application/gatway/CalculatefreightGatway";
import { GetItemGatway } from "src/application/gatway/GetItemGatway";
import { OrderPreview } from "src/application/usecases/OrderPreview";
import { Coupon } from "src/domain/entity/Coupon";
import { Item } from "src/domain/entity/Item";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { InMemoryCouponRepository } from "src/infra/repository/inMemory/InMemoryCouponRepository";

describe("OrderPreview", () => {
    let orderPreview: OrderPreview;
    let getItemGatway: GetItemGatway;
    let couponRepository: CouponRepository;
    let calculatefreightGatway: CalculatefreightGatway = {
        calculate: async () => 0,
    };
    const items = [
        new Item("1", "Guitarra", 1000),
        new Item("2", "Amplificador", 5000),
        new Item("3", "Cabo", 100),
    ];
    const getItem = async (id: string) => {
        return items.find((item) => item.idItem === id) as Item;
    };

    beforeEach(() => {
        getItemGatway = {
            getItem,
        };
        couponRepository = new InMemoryCouponRepository();
        orderPreview = new OrderPreview(
            getItemGatway,
            couponRepository,
            calculatefreightGatway,
        );
    });

    test("Should be able simulate order", async () => {
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
                {
                    idItem: "2",
                    quantity: 1,
                },
                {
                    idItem: "3",
                    quantity: 1,
                },
            ],
        };

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(6100);
    });

    test.skip("Should not be able simulate order  with invalid item", async () => {
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "4",
                    quantity: 1,
                },
            ],
        };

        expect(async () => await orderPreview.execute(input)).rejects.toThrow(
            new Error("Item not found"),
        );
    });

    test("Should be able simulate order with discount", async () => {
        couponRepository.saveCoupon(new Coupon("VALE10", 10));

        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
                {
                    idItem: "2",
                    quantity: 1,
                },
                {
                    idItem: "3",
                    quantity: 1,
                },
            ],
            coupon: "VALE10",
        };

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(5490);
    });

    test("Should not be applicable discount on expired coupon", async () => {
        couponRepository.saveCoupon(
            new Coupon("VALE10", 10, new Date("2022-12-01T23:59:59.999")),
        );

        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
                {
                    idItem: "2",
                    quantity: 1,
                },
                {
                    idItem: "3",
                    quantity: 1,
                },
            ],
            coupon: "VALE10",
            now: new Date("2022-12-02T23:59:59.999"),
        };

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(6100);
    });

    test("Should not be able simulate order  with invalid coupon", async () => {
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
            ],
            coupon: "VALE10",
        };

        expect(async () => await orderPreview.execute(input)).rejects.toThrow(
            new Error("Coupon not found"),
        );
    });

    test("Should not be able simulate order  with distance", async () => {
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
            ],
            from: "88015600",
            to: "22060030",
        };

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(1000);
    });
});
