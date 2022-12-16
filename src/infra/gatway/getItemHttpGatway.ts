import { GetItemGatway } from "src/application/gatway/GetItemGatway";
import { Item } from "src/domain/entity/Item";
import { HttpClient } from "../http/client/httpClient";

export class GetItemHttpGatway implements GetItemGatway {
    constructor(
        private readonly getItemBaseUrl: string,
        private readonly httpClient: HttpClient,
    ) {}

    async getItem(id: string): Promise<Item> {
        return this.httpClient.get(`${this.getItemBaseUrl}/${id}`);
    }
}
