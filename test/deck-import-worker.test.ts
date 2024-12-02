import { Test, TestingModule } from '@nestjs/testing';
import { DeckImportWorker } from './deck-import.worker';
import { RabbitMQService } from './rabbitmq.service';
import { mock } from 'jest-mock-extended';

describe('DeckImportWorker', () => {
  let worker: DeckImportWorker;
  let mockRabbitMQService: RabbitMQService;

  beforeEach(async () => {
    mockRabbitMQService = mock();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckImportWorker,
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
      ],
    }).compile();

    worker = module.get<DeckImportWorker>(DeckImportWorker);
  });

  it('should be defined', () => {
    expect(worker).toBeDefined();
  });

  it('should send deck import request to RabbitMQ', async () => {
    const mockDeck = { name: 'Deck 1', cards: [{ name: 'Test Card' }] };
    
    await worker.processDeckImport(mockDeck);

    expect(mockRabbitMQService.sendToQueue).toHaveBeenCalledWith('deck_import_queue', mockDeck);
  });
});
