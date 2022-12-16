import { Coupon } from "src/domain/entity/Coupon";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";

export class InMemoryCouponRepository implements CouponRepository {
    private coupons: Coupon[];

    constructor() {
        this.coupons = [];
    }

    async saveCoupon(coupon: Coupon): Promise<void> {
        this.coupons.push(coupon);
    }

    async getCoupon(couponCode: string): Promise<Coupon> {
        const coupon = this.coupons.find(
            (coupon) => coupon.code === couponCode,
        );

        if (!coupon) throw new Error("Coupon not found");
        return coupon;
    }
}
