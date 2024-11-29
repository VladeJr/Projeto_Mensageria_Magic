import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from '../cards/card';
import { CardInterface } from '../cards/card.interface';
import { BadRequestException } from '@nestjs/common';
import { Deck } from '../cards/deck';
import * as fs from 'fs';
import * as path from 'path';
import { NotificationsService } from '../service/notifications.service';

const cardsCreated: CardInterface[] = [];

@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card.name) private cardModel: Model<Card>,
        @InjectModel(Deck.name) private deckModel: Model<Deck>,
        private readonly notificationsService: NotificationsService
    ) {}

    async importDeck(deck: any): Promise<string> {
        if (deck.cards.length !== 100) {
            throw new BadRequestException('O baralho deve conter exatamente 100 cartas.');
        }

        const commanders = deck.cards.filter(card => card.type.includes('Legendary') && card.type.includes('Creature'));
        if (commanders.length !== 1) {
            throw new BadRequestException('O baralho deve conter exatamente um comandante lendário.');
        }

        const cardNames = new Set();
        for (const card of deck.cards) {
            if (cardNames.has(card.name) && !card.type.includes('Basic Land')) {
                throw new BadRequestException(`A carta ${card.name} está duplicada, o que não é permitido, exceto para terrenos básicos.`);
            }
            cardNames.add(card.name);
        }

        await this.deckModel.create(deck);

        await this.notificationsService.notifyDeckUpdate({
            action: 'import',
            deckId: deck.id,
            message: 'Baralho importado com sucesso.'
        });

        return 'Baralho importado com sucesso!';
    }

    async updateDeck(deckId: string, changes: any): Promise<string> {
        const updatedDeck = await this.deckModel.findByIdAndUpdate(deckId, changes, { new: true });
        if (!updatedDeck) {
            throw new BadRequestException('Baralho não encontrado.');
        }

        await this.notificationsService.notifyDeckUpdate({
            action: 'update',
            deckId,
            changes,
            message: 'Baralho atualizado com sucesso.'
        });

        return 'Baralho atualizado com sucesso!';
    }

}
