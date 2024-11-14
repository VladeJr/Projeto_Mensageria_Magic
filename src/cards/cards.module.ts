import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './card';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Deck, DeckSchema } from './deck';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Deck.name, schema: DeckSchema } // Registro do Deck no Mongoose
    ])
  ],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
