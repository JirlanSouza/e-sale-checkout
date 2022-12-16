import { Order } from "src/domain/entity/Order";
import { OrderPlacedEvent } from "src/domain/event/OrderPlacedEvent";
import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { OrderPlacedQueue } from "../adapter/OrderPlacedQueue";
import { GetItemGatway } from "../gatway/GetItemGatway";

export class Checkout {
    private readonly couponRepository: CouponRepository;
    private readonly orderRepository: OrderRepository;

    constructor(
        repositoryFactory: RepositoryFactory,
        private readonly getItemGatway: GetItemGatway,
        private readonly orderPlacedQueue: OrderPlacedQueue,
    ) {
        this.couponRepository = repositoryFactory.createCouponRepository();
        this.orderRepository = repositoryFactory.createOrderRepository();
    }

    async execute(input: CheckoutInput): Promise<void> {
        const nextSequence = (await this.orderRepository.count()) + 1;
        const order = new Order(input.cpf, nextSequence, input.now);

        for (const inputItem of input.items) {
            const item = await this.getItemGatway.getItem(inputItem.idItem);
            order.addItem(item, inputItem.quantity);
        }

        if (input.coupon) {
            const coupon = await this.couponRepository.getCoupon(input.coupon);
            order.addCoupon(coupon);
        }

        await this.orderRepository.saveOrder(order);
        const placedOrderEvent = new OrderPlacedEvent(order);
        await this.orderPlacedQueue.publish(placedOrderEvent);
    }
}

type CheckoutInput = {
    cpf: string;
    items: {
        idItem: string;
        quantity: number;
    }[];
    coupon?: string;
    now?: Date;
};
