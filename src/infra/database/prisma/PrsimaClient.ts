import { INestApplication, OnModuleInit } from "@nestjs/common";
import { PrismaClient as PrismaClientLib } from "@prisma/client";

export class PrismaClent extends PrismaClientLib implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on("beforeExit", async () => await app.close());
    }
}
