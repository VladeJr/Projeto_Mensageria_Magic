import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketService } from './websocket.service';
import { Server } from 'socket.io';
import { mock } from 'jest-mock-extended';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockServer: Server;

  beforeEach(async () => {
    mockServer = mock();
    service = new WebSocketService();
    service.setServer(mockServer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should emit a notification to clients', () => {
    const mockMessage = 'Deck Imported Successfully';
    service.notifyClients(mockMessage);

    expect(mockServer.emit).toHaveBeenCalledWith('notification', mockMessage);
  });
});
