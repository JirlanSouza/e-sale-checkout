export class Coupon {
    constructor(
        readonly code: string,
        readonly percentage: number,
        readonly expireDate?: Date,
    ) {
        if (percentage < 0) throw new Error("Invalid coupon percentage");
    }

    calculateDiscount(total: number, now = new Date()) {
        if (this.expireDate && this.expireDate.getTime() < now.getTime())
            return 0;
        return (total * this.percentage) / 100;
    }
}
