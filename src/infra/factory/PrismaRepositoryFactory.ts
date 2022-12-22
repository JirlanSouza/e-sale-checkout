import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { PrismaClient } from "../database/prisma/PrsimaClient";
import { InMemoryCouponRepository } from "../repository/inMemory/InMemoryCouponRepository";
import { PrismaOrderRepository } from "../repository/prisma/PrismaOrderRepository";

export class PrismaRepositoryFactory implements RepositoryFactory {
    private couponRepository?: CouponRepository;
    private orderRepository?: OrderRepository;

    constructor(private readonly prismaClient: PrismaClient) {}

    createOrderRepository(): OrderRepository {
        if (!this.orderRepository) {
            this.orderRepository = new PrismaOrderRepository(this.prismaClient);
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
