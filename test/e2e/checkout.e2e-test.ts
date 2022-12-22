import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import * as request from "supertest";

describe("Checkout", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const appModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = appModule.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test("POST /checkout: Should return the 201 status code with a success message", () => {
        const requestBody = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
                {
                    idItem: "2",
                    quantity: 1,
                },
                {
                    idItem: "3",
                    quantity: 1,
                },
            ],
        };

        return request(app.getHttpServer())
            .post("/checkout")
            .send(requestBody)
            .set("Accept", "application/json")
            .expect("content-type", "application/json; charset=utf-8")
            .expect(HttpStatus.CREATED)
            .expect({
                message:
                    "order received successfully, await an update on your email",
            });
    });
});
