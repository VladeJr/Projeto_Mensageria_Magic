import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/roles/enums/functions.enum";

@Schema()
export class User extends Document {

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    pwd: string;

    @Prop({ type: [String], enum: Object.values(Role), default: [Role.User] })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
