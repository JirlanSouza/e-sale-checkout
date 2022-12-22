import { ApiProperty } from "@nestjs/swagger";

export class PlaceOrderResultPresenter {
    @ApiProperty({
        example: "order received successfully, await an update on your email",
    })
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}
