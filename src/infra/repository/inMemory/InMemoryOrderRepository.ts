import { Order } from "src/domain/entity/Order";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Order[];

    constructor() {
        this.orders = [];
    }

    async count(): Promise<number> {
        return this.orders.length;
    }

    async saveOrder(order: Order): Promise<void> {
        this.orders.push(order);
    }

    async getOrdersByCpf(cpf: string): Promise<Order[]> {
        return this.orders.filter((order) => order.cpf.value === cpf);
    }
}
