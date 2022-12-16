import { Cpf } from "../valueObject/Cpf";
import { OrderCode } from "../valueObject/OrderCode";
import { Coupon } from "./Coupon";
import { Item } from "./Item";
import { OrderItem } from "./OrderItem";

export class Order {
    private _code: OrderCode;
    readonly cpf: Cpf;
    orderItens: OrderItem[] = [];
    coupon?: Coupon;
    freight = 0;

    constructor(
        cpf: string,
        private readonly sequence: number,
        private readonly now?: Date,
    ) {
        this.cpf = new Cpf(cpf);
        this._code = new OrderCode(sequence, now);
    }

    addItem(item: Item, quantity: number) {
        if (this.orderItens.some((thisItem) => thisItem.idItem === item.idItem))
            throw new Error("Duplicated item");
        this.orderItens.push(new OrderItem(item.idItem, item.price, quantity));
    }

    addCoupon(coupon: Coupon) {
        this.coupon = coupon;
    }

    getTotal() {
        let total = this.orderItens.reduce(
            (total, orderItem) => total + orderItem.getTotal(),
            this.freight,
        );

        if (this.coupon) {
            total -= this.coupon.calculateDiscount(total, this.now);
        }

        return total;
    }

    get code() {
        return this._code.value;
    }
}
