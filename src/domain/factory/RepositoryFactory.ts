import { CouponRepository } from "../repositoty/CouponRepository";
import { OrderRepository } from "../repositoty/OrderRepository";

export interface RepositoryFactory {
    createOrderRepository(): OrderRepository;
    createCouponRepository(): CouponRepository;
}

export const RepositoryFactory = Symbol("RepositoryFactory");
