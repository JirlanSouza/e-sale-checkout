import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Swagger } from "./infra/documentation/swagger/Swagger";
import { QueueMicroservices } from "./infra/queue/QueueMicroservice";

async function init() {
    const app = await NestFactory.create(AppModule);
    QueueMicroservices.setup(app);
    Swagger.setup(app);
    const port = parseInt(process.env.PORT) || 3000;
    app.enableShutdownHooks();
    await app.startAllMicroservices();
    await app.listen(port);
}
init();
