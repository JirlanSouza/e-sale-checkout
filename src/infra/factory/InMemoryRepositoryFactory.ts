import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { InMemoryCouponRepository } from "../repository/inMemory/InMemoryCouponRepository";
import { InMemoryOrderRepository } from "../repository/inMemory/InMemoryOrderRepository";

export class InMemoryRepositoryFactory implements RepositoryFactory {
    private couponRepository?: CouponRepository;
    private orderRepository?: OrderRepository;

    createOrderRepository(): OrderRepository {
        if (!this.orderRepository) {
            this.orderRepository = new InMemoryOrderRepository();
        }

        return this.orderRepository;
    }

    createCouponRepository(): CouponRepository {
        if (!this.couponRepository) {
            this.couponRepository = new InMemoryCouponRepository();
        }

        return this.couponRepository;
    }
}
