import { Order } from "../entity/Order";

export interface OrderRepository {
    saveOrder(order: Order): Promise<void>;
    getOrdersByCpf(cpf: string): Promise<Order[]>;
    count(): Promise<number>;
}
