import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from '../service/cards.service';
import { getModelToken } from '@nestjs/mongoose';
import { RabbitMQService } from '../service/rabbitmq.service';
import { NotificationsService } from '../service/notifications.service';
import { NotificationsGateway } from '../service/notifications.gateway';

describe('CardsService', () => {
  let service: CardsService;
  let rabbitMQService: RabbitMQService;

  const mockRabbitMQService = {
    sendMessage: jest.fn(),
  };

  const mockDeckModel = {
    create: jest.fn(),
  };

  const mockCardModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockNotificationsGateway = {
    notifyClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        { provide: getModelToken('Card'), useValue: mockCardModel },
        { provide: getModelToken('Deck'), useValue: mockDeckModel },
        { provide: RabbitMQService, useValue: mockRabbitMQService },
        { provide: NotificationsGateway, useValue: mockNotificationsGateway },
        NotificationsService,
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should enqueue a deck with admin priority', async () => {
    const deck = { cards: Array(100).fill({ name: 'Test Card', type: 'Legendary Creature' }) };
    await service.enqueueDeckImport(deck, true);

    expect(mockDeckModel.create).toHaveBeenCalledWith(deck);
    expect(mockRabbitMQService.sendMessage).toHaveBeenCalledWith(
      'deck_import_queue',
      deck,
      { priority: 10 }
    );
  });

  it('should enqueue a deck with normal priority', async () => {
    const deck = { cards: Array(100).fill({ name: 'Test Card', type: 'Legendary Creature' }) };
    await service.enqueueDeckImport(deck, false);

    expect(mockDeckModel.create).toHaveBeenCalledWith(deck);
    expect(mockRabbitMQService.sendMessage).toHaveBeenCalledWith(
      'deck_import_queue',
      deck,
      { priority: 1 }
    );
  });
});
