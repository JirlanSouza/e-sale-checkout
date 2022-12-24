import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ChannelWrapper, connect as ampConnect } from "amqp-connection-manager";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { AppModule } from "src/app.module";
import { PlaceOrderComand } from "src/application/comands/placeOrder";
import * as request from "supertest";

jest.setTimeout(20000);
describe("Checkout", () => {
    let app: INestApplication;
    let amqpConnection: IAmqpConnectionManager;
    let amqpChanel: ChannelWrapper;

    beforeAll(async () => {
        const appModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = appModule.createNestApplication();
        await app.init();

        amqpConnection = ampConnect("amqp://localhost");
        amqpChanel = amqpConnection.createChannel();
        await amqpChanel.assertQueue("placeOrder");
    });

    afterAll(async () => {
        await app.close();
        amqpChanel.ackAll();
        await amqpChanel.close();
        await amqpConnection.close();
    });

    test("POST /checkout: Should return the 201 status code with a success message", async () => {
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

        await request(app.getHttpServer())
            .post("/checkout")
            .send(requestBody)
            .set("Accept", "application/json")
            .expect("content-type", "application/json; charset=utf-8")
            .expect(HttpStatus.CREATED)
            .expect({
                message:
                    "order received successfully, await an update on your email",
            });

        await new Promise((resolve, reject) => {
            amqpChanel.consume("placeOrder", (msg) => {
                try {
                    const placeOrderComander: PlaceOrderComand = JSON.parse(
                        msg.content.toString(),
                    ).data;

                    expect(placeOrderComander).toEqual(
                        expect.objectContaining(requestBody),
                    );
                    amqpChanel.ack(msg);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            });
        });
    });
});
