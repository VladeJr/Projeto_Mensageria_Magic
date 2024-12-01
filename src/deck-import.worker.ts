import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { LoggingService } from './service/logging.service';

@Injectable()
export class DeckImportWorker {
  constructor(private readonly loggingService: LoggingService) {}

  @RabbitSubscribe({
    exchange: '',
    routingKey: 'deck_import_queue',
    queue: 'deck_import_queue',
    queueOptions: {
      durable: true,
      arguments: {
        'x-max-priority': 10,
      },
    },
  })
  async handleDeckImport(deck: any): Promise<void> {
    this.loggingService.log(`Received deck for import: ${JSON.stringify(deck)}`, 'DeckImportWorker');

    // Simula o processamento do deck
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.loggingService.log(`Deck import completed for ID: ${deck.id}`, 'DeckImportWorker');
  }
}
