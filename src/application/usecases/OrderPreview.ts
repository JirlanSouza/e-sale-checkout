import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { Order } from "../../domain/entity/Order";
import { CalculatefreightGatway } from "../gatway/CalculatefreightGatway";
import { GetItemGatway } from "../gatway/GetItemGatway";

export class OrderPreview {
    constructor(
        private readonly getItemGatway: GetItemGatway,
        private readonly couponRepository: CouponRepository,
        private readonly calculatefreightGatway: CalculatefreightGatway,
    ) {}

    async execute(input: PreviewCheckoutInput): Promise<PreviewCheckoutOutput> {
        const order = new Order(input.cpf, 1, input.now);
        let orderItems = [];

        for (const inputItem of input.items) {
            const item = await this.getItemGatway.getItem(inputItem.idItem);
            order.addItem(item, inputItem.quantity);
            orderItems.push({
                volume: item.getVolume(),
                density: item.getDensity(),
                quantity: inputItem.quantity,
            });
        }

        if (input.from && input.to) {
            order.freight = await this.calculatefreightGatway.calculate({
                items: orderItems,
                from: input.from,
                to: input.to,
            });
        }

        if (input.coupon) {
            const coupon = await this.couponRepository.getCoupon(input.coupon);
            order.addCoupon(coupon);
        }

        const total = order.getTotal();
        return { total };
    }
}

type PreviewCheckoutInput = {
    cpf: string;
    items: {
        idItem: string;
        quantity: number;
    }[];
    coupon?: string;
    now?: Date;
    from?: string;
    to?: string;
};

type PreviewCheckoutOutput = {
    total: number;
};
