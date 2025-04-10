import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CharacterClass {
  WARRIOR = 'Guerreiro',
  MAGE = 'Mago',
  ARCHER = 'Arqueiro',
  ROGUE = 'Ladino',
  BARD = 'Bardo',
}

@Schema({ timestamps: true })
export class Character extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  adventurerName: string;

  @Prop({ required: true, enum: CharacterClass })
  class: CharacterClass;

  @Prop({ required: true, default: 1 })
  level: number;

  @Prop({ required: true, min: 0, max: 10 })
  strength: number;

  @Prop({ required: true, min: 0, max: 10 })
  defense: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'MagicItem' }] })
  magicItems: Types.ObjectId[];
}

export const CharacterSchema = SchemaFactory.createForClass(Character); 