import { Module } from "@nestjs/common";
import { HttpModule } from "./infra/http/http.module";
import { QueueModule } from "./infra/queue/queue.module";

@Module({
    imports: [HttpModule, QueueModule],
})
export class AppModule {}
