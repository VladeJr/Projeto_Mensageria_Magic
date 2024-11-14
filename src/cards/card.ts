import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Card extends Document{

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({ type: [String]})
    colors: string[];

    @Prop()
    type: string;

    @Prop()
    mana: string;

    @Prop()
    power: string;

    @Prop()
    toughness: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
