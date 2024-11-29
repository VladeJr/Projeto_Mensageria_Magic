import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async notifyDeckUpdate(updateDetails: any) {
    await this.rabbitMQService.sendNotification(updateDetails);
    this.notificationsGateway.notifyClient('deck_update', updateDetails);
  }
}
