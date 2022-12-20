import {
    OrderItem as OrderItemsModel,
    Order as OrderModel,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { Item } from "src/domain/entity/Item";
import { Order } from "src/domain/entity/Order";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { PrismaClent } from "src/infra/database/prisma/PrsimaClient";

export class PrismaOrderRepository implements OrderRepository {
    constructor(private readonly prismaClient: PrismaClent) {}

    async saveOrder(order: Order): Promise<void> {
        await this.prismaClient.order.create({
            data: this.entityToModel(order),
        });
    }

    async getOrdersByCpf(cpf: string): Promise<Order[]> {
        const ordersModel = await this.prismaClient.order.findMany({
            where: { cpf },
            include: {
                OrderItem: true,
            },
        });
        return ordersModel.map((orderModel) =>
            this.modelToEntity(orderModel, orderModel.OrderItem),
        );
    }
    count(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    private entityToModel(order: Order) {
        return {
            id: randomUUID(),
            code: order.code,
            cpf: order.cpf.value,
            coupon_code: order.coupon.code,
            coupon_percentage: order.coupon.percentage,
            freight: order.freight,
            issue_date: new Date(),
            sequence: 1,
            total: order.getTotal(),
        };
    }

    private modelToEntity(
        model: OrderModel,
        orderItemsModel: OrderItemsModel[],
    ) {
        const order = new Order(model.cpf, model.sequence);
        for (const orderItemModel of orderItemsModel) {
            order.addItem(
                new Item(
                    orderItemModel.id,
                    "",
                    orderItemModel.price.toNumber(),
                ),
                orderItemModel.quantity,
            );
        }
        return order;
    }
}
