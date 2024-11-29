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

@Injectable()
export class CardsService {
    enqueueDeckImport(deck: any) {
        throw new Error('Method not implemented.');
    }
    deleteAll() {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Card | PromiseLike<Card> {
        throw new Error('Method not implemented.');
    }
    update(id: string, card: Card): Card | PromiseLike<Card> {
        throw new Error('Method not implemented.');
    }
    getByName(name: string): Card[] | PromiseLike<Card[]> {
        throw new Error('Method not implemented.');
    }
    getCardById(id: string): Card | PromiseLike<Card> {
        throw new Error('Method not implemented.');
    }
    getAllCards(): Card[] | PromiseLike<Card[]> {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectModel(Card.name) private cardModel: Model<Card>,
        @InjectModel(Deck.name) private deckModel: Model<Deck>,
        private readonly notificationsService: NotificationsService
    ) {}

    async importDeck(deck: any): Promise<string> {
        if (deck.cards.length !== 100) {
            throw new BadRequestException('The deck must contain exactly 100 cards.');
        }
        const commanders = deck.cards.filter(card => card.type.includes('Legendary') && card.type.includes('Creature'));
        if (commanders.length !== 1) {
            throw new BadRequestException('The deck must contain exactly one legendary commander.');
        }

        await this.deckModel.create(deck);
        await this.notificationsService.notifyDeckUpdate({
            action: 'import',
            deckId: deck.id,
            status: 'queued',
        });

        return 'Deck imported successfully!';
    }

    async createDeckByLegendary(legend: string): Promise<{ message: string; statusCode: number }> {
        try {
            const response = await fetch(`https://api.scryfall.com/cards/search?q=name%3A${legend}`);
            const responseData: any = await response.json();
            const obj: any = responseData.data[0];
            const colors = obj.color_identity.map((color) => color);

            const card: CardInterface = {
                name: obj.name,
                description: obj.oracle_text,
                colors: colors,
                type: obj.type_line,
                mana: obj.mana_cost,
                power: obj.power,
                toughness: obj.toughness,
            };

            const cardLegendary = await this.create(card);
            const cards = await this.allCards(colors);

            const deckDirectory = path.resolve(__dirname, '..', '..', 'src', 'cards');
            let deckNumber = 1;

            while (fs.existsSync(path.join(deckDirectory, `deck${deckNumber}.json`))) {
                deckNumber++;
            }

            const filename = `deck${deckNumber}.json`;
            const filePath = path.join(deckDirectory, filename);

            fs.writeFileSync(filePath, JSON.stringify(cards, null, 2));

            return { message: "Ready Deck", statusCode: 201 };
        } catch (error) {
            console.error("Error creating legendary deck:", error);
            throw new BadRequestException(error.message);
        }
    }
    allCards(colors: any) {
        throw new Error('Method not implemented.');
    }
    create(card: CardInterface) {
        throw new Error('Method not implemented.');
    }

    // Outros métodos permanecem inalterados...
}
