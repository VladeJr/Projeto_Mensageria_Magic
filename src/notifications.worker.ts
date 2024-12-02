import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { NotificationsGateway } from './service/notifications.gateway';
import { LoggingService } from './service/logging.service';

@Injectable()
export class NotificationsWorker {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly loggingService: LoggingService
  ) {}

  @RabbitSubscribe({
    exchange: '', 
    routingKey: 'deck_updates_queue',
    queue: 'deck_updates_queue',
    queueOptions: {
      durable: true, 
    },
  })
  async handleDeckUpdateNotification(updateDetails: any): Promise<void> {
    this.loggingService.log(
      `Received update notification: ${JSON.stringify(updateDetails)}`,
      'NotificationsWorker'
    );

    this.notificationsGateway.notifyClient('deck_update', updateDetails);
  }
}
