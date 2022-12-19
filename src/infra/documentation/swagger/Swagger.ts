import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class Swagger {
    static setup(app: INestApplication) {
        const config = new DocumentBuilder()
            .setTitle("E-sale-checkout micro-service")
            .setDescription("The checkout microservice off E-sale system")
            .setVersion("1.0")
            .addTag("checkout")
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("doc", app, document);
    }
}
