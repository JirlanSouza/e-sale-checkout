import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { PlaceOrderComand } from "src/application/comands/placeOrder";
import { Checkout } from "src/application/usecases/Chekout";

@Controller()
export class CheckoutQueueController {
    constructor(private readonly checkoutUseCase: Checkout) {}

    @EventPattern("placeOrder")
    async placeOrder(@Payload() msgData: PlaceOrderComand) {
        this.checkoutUseCase.execute(msgData);
        Logger.log(
            "Consume the new event in topic: placeOrder",
            CheckoutQueueController.name,
        );
    }
}
