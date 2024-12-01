import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { CardsService } from '../service/cards.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/functions.enum';
import { BadRequestException } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
    constructor(
        private readonly cardsService: CardsService
    ) {}

    @Roles(Role.User, Role.Admin)
    @Post('/enqueueImportDeck')
    async enqueueDeckImport(@Body() deck: any, @Req() req: any): Promise<string> {
        const isAdmin = req.user.role === Role.Admin;
        try {
            await this.cardsService.enqueueDeckImport(deck, isAdmin);
            return 'Deck import request queued successfully!';
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
