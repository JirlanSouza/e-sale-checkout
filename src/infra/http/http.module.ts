import { Module } from "@nestjs/common";
import { QueueModule } from "../queue/queue.module";
import { CheckoutController } from "./controller/checkout.controller";

@Module({
    imports: [QueueModule],
    controllers: [CheckoutController],
})
export class HttpModule {}
