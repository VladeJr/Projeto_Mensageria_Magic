import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@nestjs-plus/rabbitmq';

@Injectable()
export class DeckImportWorker {
  @RabbitSubscribe({
    exchange: '',
    routingKey: 'deck_import_queue',
    queue: 'deck_import_queue',
  })
  async handleDeckImport(deck: any): Promise<void> {
    console.log(`Received deck for import: ${JSON.stringify(deck)}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Deck import completed for ID: ${deck.id}`);
  }
}
