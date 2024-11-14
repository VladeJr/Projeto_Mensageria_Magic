import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from './card';
import { Model } from 'mongoose';
import { CardInterface } from './card.interface';
import { BadRequestException } from '@nestjs/common';
import { Deck } from './deck';
import * as fs from 'fs';
import * as path from 'path';

const cardsCreated: CardInterface[] = [];

@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card.name) private cardModel: Model<Card>,
        @InjectModel(Deck.name) private deckModel: Model<Deck>
    ) {}

    async importDeck(deck: any): Promise<string> {
            // Verifica se o baralho tem 100 cartas
        if (deck.cards.length !== 100) {
            throw new BadRequestException('O baralho deve conter exatamente 100 cartas.');
        }
    
         // Verifica se há exatamente um comandante
        const commanders = deck.cards.filter(card => card.type.includes('Legendary') && card.type.includes('Creature'));
        if (commanders.length !== 1) {
                throw new BadRequestException('O baralho deve conter exatamente um comandante lendário.');
            }
    
         // Verifica se não há cartas duplicadas (exceto terrenos básicos)
        const cardNames = new Set();
        for (const card of deck.cards) {
           if (cardNames.has(card.name) && !card.type.includes('Basic Land')) {
                throw new BadRequestException(`A carta ${card.name} está duplicada, o que não é permitido, exceto para terrenos básicos.`);
            }
            cardNames.add(card.name);
        }
    
        // Salva o baralho no banco de dados
        await this.deckModel.create(deck);
        return 'Baralho importado com sucesso!';
    }

    async getAllCards(): Promise<Card[]> {
        try {
            return await this.cardModel.find().exec();
        } catch (err) {
            throw new err;
        }
    }

    async create(card: Card | CardInterface): Promise<Card> {
        try {
            const cardCreated = new this.cardModel(card);
            return await cardCreated.save();
        } catch (err) {
            throw new err;
        }
    }

    async getCardById(id: string): Promise<Card> {
        try {
            return await this.cardModel.findById(id).exec();
        } catch (err) {
            throw new err;
        }
    }

    async getByName(name: string): Promise<Card[]> {
        try {
            return await this.cardModel.find({
                name: { $regex: name, $options: 'i'},
            }).exec();
        } catch (err) {
            throw new err;
        }
    }

    async update(id: string, card: Card): Promise<Card> {
        try {
            return await this.cardModel.findByIdAndUpdate(id, card).exec();
        } catch (err) {
            throw new err;
        }
    }

    async delete(id: string) {
        try {
            const cardDeleted = this.cardModel.findOneAndDelete({ _id: id }).exec();
            return await cardDeleted;
        } catch (err) {
            throw new err;
        }
    }
    
    async deleteAll() {
        try {
            await this.cardModel.deleteMany();
        } catch (err) {
            throw new err;
        }
    }

    async allCards(color: string) {
        try {
            const response = await fetch(`https://api.scryfall.com/cards/search?q=c%3A${color}&unique%3Dcards`);
            const responseData = await response.json();
            const data = await responseData.data.slice(0, 99);
            for (const card of data) {
                let colors = card.color_identity.map((color) => color);
                let cardsAll: CardInterface = {
                    name: card.name,
                    description: card.oracle_text,
                    colors: colors,
                    type: card.type_line,
                    mana: card.mana_cost,
                    power: card.power,
                    toughness: card.toughness
                }
                const cardCreated = await this.create(cardsAll);
                cardsCreated.push(cardCreated);
            }
            return cardsCreated;
        } catch (err) {
            throw new err;
        }
    }

    async createDeckByLegendary(legend: string) {
        try {
            // Fetch the legendary card
            const response = await fetch(`https://api.scryfall.com/cards/search?q=name%3A${legend}`);
            if (!response) {
                throw new Error(`HTTP error! status: ${(await response).status}`);
            }

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
                toughness: obj.toughness
            }

            const cardLegendary = await this.create(card);
            cardsCreated.push(cardLegendary);

            const cards = await this.allCards(colors);

            const deckDirectory = path.resolve(__dirname, '..', '..', 'src', 'cards');
            let deckNumber = 1;

            while (fs.existsSync(path.join(deckDirectory, `deck${deckNumber}.json`))) {
                deckNumber++;
            }

            const filename = `deck${deckNumber}.json`;
            const filePath = path.join(deckDirectory, filename);

            fs.writeFile(filePath, JSON.stringify(cards, null, 2), (err) => {
                if (err) {
                    console.log('Deu erro: ' + err);
                } else {
                    console.log(`Arquivo ${filename} criado com sucesso.`);
                }
            });

            return { message: "Ready Deck", statusCode: 201 };

        } catch (error) {
            console.error("Erro ao buscar carta lendária:", error);
        }
    }
}
