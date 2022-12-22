import {
    INestApplication,
    Injectable,
    Logger,
    OnModuleInit,
} from "@nestjs/common";
import { PrismaClient as PrismaClientLib } from "@prisma/client";

@Injectable()
export class PrismaClient extends PrismaClientLib implements OnModuleInit {
    async onModuleInit() {
        const tryConnectReapeat = 5;
        for (
            let connectionTryCount = 0;
            connectionTryCount < tryConnectReapeat;
            connectionTryCount++
        ) {
            try {
                await this.$connect();
                Logger.log(
                    "The prisma client has been connected to database",
                    PrismaClient.name,
                );
                break;
            } catch (err) {
                Logger.error(err.message, PrismaClient.name);
                if (connectionTryCount == tryConnectReapeat - 1) {
                    Logger.error(
                        `The prisma client does not connect to database, exiting of application!`,
                        PrismaClient.name,
                    );
                    process.exit(1);
                }
                await this.sllep(1000);
            }
        }
    }

    private async sllep(duration: number) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on("beforeExit", async () => {
            await app.close();
            Logger.log("The prisma client has closed", PrismaClient.name);
        });
    }
}
