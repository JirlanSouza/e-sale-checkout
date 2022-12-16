import { Body, Controller, Inject, Post } from "@nestjs/common";
import { PlaceOrderQueue } from "src/application/adapter/PlaceOrderQueue";
import { PlaceOrderComand } from "src/application/comands/placeOrder";
import { PlaceOrderDto } from "../Dtos/placeOrder";

@Controller("/checkout")
export class CheckoutController {
    constructor(
        @Inject(PlaceOrderQueue)
        private readonly placeOrderQueue: PlaceOrderQueue,
    ) {}

    @Post()
    async placeOrder(@Body() placeOrderData: PlaceOrderDto) {
        const comand = new PlaceOrderComand(
            placeOrderData.cpf,
            placeOrderData.items,
            placeOrderData.coupon,
        );

        this.placeOrderQueue.publish(comand);
    }
}
