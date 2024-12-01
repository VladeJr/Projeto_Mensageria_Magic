import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

  async sendMessage(queue: string, message: any, options: any = {}): Promise<void> {
    await this.client.emit(queue, { message, options }).toPromise();
  }
}
