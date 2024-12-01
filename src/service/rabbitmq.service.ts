import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggingService } from './logging.service';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly loggingService: LoggingService
  ) {}

  async sendMessage(queue: string, message: any, options: any = {}): Promise<void> {
    this.loggingService.log(`Sending message to queue: ${queue}`, 'RabbitMQService');
    try {
      await this.client.emit(queue, { message, options }).toPromise();
      this.loggingService.log(`Message sent to queue: ${queue}`, 'RabbitMQService');
    } catch (error) {
      this.loggingService.error(`Failed to send message to queue: ${queue}`, error.stack, 'RabbitMQService');
      throw error;
    }
  }
}
