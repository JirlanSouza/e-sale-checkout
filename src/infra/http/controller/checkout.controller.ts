import { Body, Controller, HttpStatus, Inject, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { PlaceOrderQueue } from "src/application/adapter/PlaceOrderQueue";
import { PlaceOrderComand } from "src/application/comands/placeOrder";
import { PlaceOrderDto } from "../Dtos/placeOrder";
import { PlaceOrderResultPresenter } from "../Presenter/PlaceOrderResult";

@Controller("/checkout")
export class CheckoutController {
    constructor(
        @Inject(PlaceOrderQueue)
        private readonly placeOrderQueue: PlaceOrderQueue,
    ) {}

    @Post()
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: PlaceOrderResultPresenter,
    })
    async placeOrder(@Body() placeOrderData: PlaceOrderDto) {
        const comand = new PlaceOrderComand(
            placeOrderData.cpf,
            placeOrderData.items,
            placeOrderData.coupon,
        );

        const result = await this.placeOrderQueue.publish(comand);

        if (!result) {
            throw new Error("Error to receive order");
        }

        return new PlaceOrderResultPresenter(
            "order received successfully, await an update on your email",
        );
    }
}
