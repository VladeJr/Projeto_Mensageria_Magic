import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from './service/rabbitmq.service';
import { RabbitMQController } from './controller/rabbitmq.controller';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'], 
          queue: 'default_queue', 
          queueOptions: {
            durable: true, 
          },
        },
      },
    ]),
  ],
  controllers: [RabbitMQController],
  providers: [RabbitMQService],
})
export class AppModule {}
