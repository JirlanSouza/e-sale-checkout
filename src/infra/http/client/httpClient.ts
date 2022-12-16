export interface HttpClient {
    get<T>(url): Promise<T>;
}

export const HttpClient = Symbol("HttpClient");
