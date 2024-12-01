import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from '../cards/card';
import { CardInterface } from '../cards/card.interface';
import { BadRequestException } from '@nestjs/common';
import { Deck } from '../cards/deck';
import { NotificationsService } from '../service/notifications.service';
import { RabbitMQService } from '../service/rabbitmq.service';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card.name) private cardModel: Model<Card>,
        @InjectModel(Deck.name) private deckModel: Model<Deck>,
        private readonly notificationsService: NotificationsService,
        private readonly rabbitMQService: RabbitMQService
    ) {}

    async enqueueDeckImport(deck: any, isAdmin: boolean): Promise<void> {
        if (deck.cards.length !== 100) {
            throw new BadRequestException('The deck must contain exactly 100 cards.');
        }
        const commanders = deck.cards.filter(card => card.type.includes('Legendary') && card.type.includes('Creature'));
        if (commanders.length !== 1) {
            throw new BadRequestException('The deck must contain exactly one legendary commander.');
        }

        await this.deckModel.create(deck);

        const priority = isAdmin ? 10 : 1; 
        await this.rabbitMQService.sendMessage('deck_import_queue', deck, { priority });
    }
}
