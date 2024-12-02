import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import { mock } from 'jest-mock-extended'; // Para simular dependências externas

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(async () => {
    mockChannel = mock();
    mockConnection = mock();
    mockConnection.createChannel.mockResolvedValue(mockChannel);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: 'AMQP_CONNECTION',
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send message to the queue', async () => {
    const mockMessage = { name: 'Test Card' };
    await service.sendToQueue('deck_import_queue', mockMessage);

    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'deck_import_queue',
      expect.any(Buffer),
      { persistent: true },
    );
  });
});
