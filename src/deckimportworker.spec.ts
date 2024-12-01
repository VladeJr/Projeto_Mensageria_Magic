import { Test, TestingModule } from '@nestjs/testing';
import { DeckImportWorker } from './deck-import.worker';

describe('DeckImportWorker', () => {
  let worker: DeckImportWorker;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeckImportWorker],
    }).compile();

    worker = module.get<DeckImportWorker>(DeckImportWorker);
  });

  it('should process a deck from the queue', async () => {
    const deck = { id: '12345', cards: [] };
    const consoleSpy = jest.spyOn(console, 'log');

    await worker.handleDeckImport(deck);

    expect(consoleSpy).toHaveBeenCalledWith(`Received deck for import: ${JSON.stringify(deck)}`);
    expect(consoleSpy).toHaveBeenCalledWith(`Deck import completed for ID: ${deck.id}`);
  });
});
