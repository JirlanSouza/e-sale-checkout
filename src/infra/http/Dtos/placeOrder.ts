import { ApiProperty } from "@nestjs/swagger";

class ItemDto {
    @ApiProperty({ example: "123456789" })
    idItem: string;

    @ApiProperty({ example: 2 })
    quantity: number;
}

export class PlaceOrderDto {
    @ApiProperty({ example: "111.444.777-35" })
    cpf: string;

    @ApiProperty({ type: [ItemDto] })
    items: ItemDto[];

    @ApiProperty({ example: "VALE10" })
    coupon?: string;
}
