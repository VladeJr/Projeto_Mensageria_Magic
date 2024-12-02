import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto'; // DTO para a criação da carta

describe('CardsService', () => {
  let service: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsService],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new card', () => {
    const createCardDto: CreateCardDto = { name: 'Test Card', type: 'Creature', mana: '1G', power: '2', toughness: '2' };
    const card = service.createCard(createCardDto);

    expect(card).toHaveProperty('name', 'Test Card');
    expect(card).toHaveProperty('type', 'Creature');
  });

  it('should return all cards', () => {
    const card1 = service.createCard({ name: 'Test Card 1', type: 'Creature', mana: '1G', power: '2', toughness: '2' });
    const card2 = service.createCard({ name: 'Test Card 2', type: 'Creature', mana: '1U', power: '3', toughness: '3' });

    const allCards = service.findAll();
    expect(allCards.length).toBe(2);
    expect(allCards).toContainEqual(card1);
    expect(allCards).toContainEqual(card2);
  });
});
