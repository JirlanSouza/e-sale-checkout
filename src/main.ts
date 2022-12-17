import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function init() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      url: "amqp://localhost",
      queue: "placeOrder",
    },
  });

  const config = new DocumentBuilder()
    .setTitle("E-sale-checkout micro-service")
    .setDescription("The checkout microservice off E-sale system")
    .setVersion("1.0")
    .addTag("checkout")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document);

  const port = parseInt(process.env.PORT) || 3000;
  await app.startAllMicroservices();
  await app.listen(port);
}
init();
