import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ItemType {
  WEAPON = 'Arma',
  ARMOR = 'Armadura',
  AMULET = 'Amuleto',
}

@Schema({ timestamps: true })
export class MagicItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ItemType })
  type: ItemType;

  @Prop({ required: true, min: 0, max: 10 })
  strength: number;

  @Prop({ required: true, min: 0, max: 10 })
  defense: number;

  @Prop({ type: Types.ObjectId, ref: 'Character' })
  character: Types.ObjectId;
}

export const MagicItemSchema = SchemaFactory.createForClass(MagicItem);

// Add validation for item type constraints
MagicItemSchema.pre('save', function(next) {
  if (this.type === ItemType.WEAPON && this.defense !== 0) {
    next(new Error('Weapons must have 0 defense'));
  }
  if (this.type === ItemType.ARMOR && this.strength !== 0) {
    next(new Error('Armor must have 0 strength'));
  }
  if (this.strength === 0 && this.defense === 0) {
    next(new Error('Item must have at least one non-zero attribute'));
  }
  next();
}); 