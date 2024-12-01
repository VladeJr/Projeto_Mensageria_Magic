import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CardsModule } from './cards/cards.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DeckImportWorker } from './deck-import.worker';
import { NotificationsService } from './service/notifications.service';
import { NotificationsGateway } from './service/notifications.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
    }),
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
    CardsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [DeckImportWorker, NotificationsService, NotificationsGateway],
})
export class AppModule {}
