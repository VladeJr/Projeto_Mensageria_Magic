import { Controller, Post } from '@nestjs/common';
import { RabbitMQService } from '../service/rabbitmq.service';

@Controller('rabbitmq')
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('test')
  async sendMessage() {
    await this.rabbitMQService.sendMessage('test_queue', { text: 'Hello RabbitMQ!' });
    return { status: 'Message sent!' };
  }
}
