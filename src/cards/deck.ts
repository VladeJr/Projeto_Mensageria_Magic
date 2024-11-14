import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Deck extends Document {
    @Prop()
    name: string;

    @Prop()
    userId: string; // ID do usuário dono do deck

    @Prop({ type: [Object] })
    cards: any[]; // Lista de cartas do baralho
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
