import { GetItemGatway } from "src/application/gatway/GetItemGatway";
import { Item } from "src/domain/entity/Item";
import { Dimension } from "src/domain/valueObject/Dimension";

export class InMemorygetItemGatway implements GetItemGatway {
    async getItem(id: string): Promise<Item> {
        return new Item(id, "Item test", 200, new Dimension(100, 100, 200, 2));
    }
}
