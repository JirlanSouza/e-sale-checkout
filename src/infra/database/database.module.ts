import { Module } from "@nestjs/common";
import { PrismaClient } from "./prisma/PrsimaClient";

@Module({
    providers: [PrismaClient],
    exports: [PrismaClient],
})
export class DatabaseModule {}
