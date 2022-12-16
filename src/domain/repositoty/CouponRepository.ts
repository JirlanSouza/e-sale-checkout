import { Coupon } from "../entity/Coupon";

export interface CouponRepository {
    saveCoupon(coupon: Coupon): Promise<void>;
    getCoupon(couponCode: string): Promise<Coupon>;
}
