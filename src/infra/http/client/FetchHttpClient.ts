import { HttpClient } from "./httpClient";

export class FetchHttpClient implements HttpClient {
    async get<T>(url: any): Promise<T> {
        const resposne = await fetch(url);
        return await resposne.json();
    }
}
