import { Deserializer, Serializer } from "@nestjs/microservices";
import { RmqUrl } from "@nestjs/microservices/external/rmq-url.interface";

export interface RmqOptions {
    urls?: string[] | RmqUrl[];
    queue?: string;
    prefetchCount?: number;
    isGlobalPrefetchCount?: boolean;
    queueOptions?: any; // AmqplibQueueOptions;
    socketOptions?: any; // AmqpConnectionManagerSocketOptions;
    noAck?: boolean;
    serializer?: Serializer;
    deserializer?: Deserializer;
    replyQueue?: string;
    persistent?: boolean;
    headers?: Record<string, string>;
    noAssert?: boolean;
    /**
     * Maximum number of connection attempts.
     * Applies only to the consumer configuration.
     * -1 === infinite
     * @default -1
     */
    maxConnectionAttempts?: number;
}
