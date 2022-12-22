import { Module } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { OrderPlacedQueue } from "src/application/adapter/OrderPlacedQueue";
import { PlaceOrderQueue } from "src/application/adapter/PlaceOrderQueue";
import { GetItemGatway } from "src/application/gatway/GetItemGatway";
import { Checkout } from "src/application/usecases/Chekout";
import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { DatabaseModule } from "../database/database.module";
import { PrismaClient } from "../database/prisma/PrsimaClient";
import { PrismaRepositoryFactory } from "../factory/PrismaRepositoryFactory";
import { InMemorygetItemGatway } from "../gatway/InMemoryGetItemGatway";
import { InMemoryOrderPlacedQueueAdapter } from "./adapter/InMemoryQueueAdapter";
import { OrderPlacedRmqQueueAdapter } from "./adapter/OrderPlacedRmqQueueAdapter";
import { PlaceOrderRmqQueueAdapter } from "./adapter/PlaceOrderRmqQueueAdapter";
import { CheckoutQueueController } from "./controller/checkoutQueue.controller";
import { QueueClientProxyFactory } from "./factory/QueueClientProxyFactory";

@Module({
    imports: [QueueClientProxyFactory.create(), DatabaseModule],
    controllers: [CheckoutQueueController],
    providers: [
        InMemoryOrderPlacedQueueAdapter,
        {
            provide: PlaceOrderQueue,
            inject: [QueueClientProxyFactory.placeOrderQueueClientProxy],
            useFactory: (clientproxy: ClientProxy) =>
                new PlaceOrderRmqQueueAdapter(clientproxy),
        },
        {
            provide: OrderPlacedQueue,
            inject: [QueueClientProxyFactory.orderPlaceQueueClientProxy],
            useFactory: (clientproxy: ClientProxy) =>
                new OrderPlacedRmqQueueAdapter(clientproxy),
        },
        {
            provide: RepositoryFactory,
            inject: [PrismaClient],
            useFactory: (prismaClient: PrismaClient) =>
                new PrismaRepositoryFactory(prismaClient),
        },
        {
            provide: GetItemGatway,
            useClass: InMemorygetItemGatway,
        },
        {
            provide: Checkout,
            inject: [RepositoryFactory, GetItemGatway, OrderPlacedQueue],
            useFactory: (
                repositoryFactory: RepositoryFactory,
                getItemGatway: GetItemGatway,
                orderPlacedQueue: OrderPlacedQueue,
            ) => {
                return new Checkout(
                    repositoryFactory,
                    getItemGatway,
                    orderPlacedQueue,
                );
            },
        },
    ],
    exports: [PlaceOrderQueue, OrderPlacedQueue],
})
export class QueueModule {}
