import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async notifyDeckUpdate(updateDetails: any) {
    await this.rabbitMQService.sendNotification(updateDetails);
  }
}
