import { OrderPlacedQueue } from "src/application/adapter/OrderPlacedQueue";
import { GetItemGatway } from "src/application/gatway/GetItemGatway";
import { Checkout } from "src/application/usecases/Chekout";
import { Coupon } from "src/domain/entity/Coupon";
import { Item } from "src/domain/entity/Item";
import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { InMemoryRepositoryFactory } from "src/infra/factory/InMemoryRepositoryFactory";
import { InMemoryOrderPlacedQueueAdapter } from "src/infra/queue/adapter/InMemoryQueueAdapter";

describe("Checkout", () => {
    let checkout: Checkout;
    let repositoryFactory: RepositoryFactory;
    let getItemGatway: GetItemGatway;
    let couponRepository: CouponRepository;
    let orderRepository: OrderRepository;
    let queue: OrderPlacedQueue;
    const items = [
        new Item("1", "Guitarra", 1000),
        new Item("2", "Amplificador", 5000),
        new Item("3", "Cabo", 100),
    ];
    const getItem = async (id: string) => {
        return items.find((item) => item.idItem === id) as Item;
    };

    beforeEach(() => {
        repositoryFactory = new InMemoryRepositoryFactory();
        getItemGatway = {
            getItem,
        };
        couponRepository = repositoryFactory.createCouponRepository();
        orderRepository = repositoryFactory.createOrderRepository();
        queue = new InMemoryOrderPlacedQueueAdapter();
        checkout = new Checkout(repositoryFactory, getItemGatway, queue);
    });

    test("Must place an order", async () => {
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

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders).toHaveLength(1);
        expect(orders[0].getTotal()).toBe(6100);
    });

    test.skip("Must not place an order  with invalid item", async () => {
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "4",
                    quantity: 1,
                },
            ],
        };

        expect(async () => await checkout.execute(input)).rejects.toThrow(
            new Error("Item not found"),
        );
    });

    test("Must place an order  with discount", async () => {
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

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders).toHaveLength(1);
        expect(orders[0].getTotal()).toBe(5490);
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

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders).toHaveLength(1);
        expect(orders[0].getTotal()).toBe(6100);
    });

    test("Must not place an order  with invalid coupon", async () => {
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

        expect(async () => await checkout.execute(input)).rejects.toThrow(
            new Error("Coupon not found"),
        );
    });

    test("Should able create order with code", async () => {
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
            ],
            now: new Date("2022-12-01T00:00:00.000"),
        };

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders[0].code).toBe("202200000001");
    });
});
