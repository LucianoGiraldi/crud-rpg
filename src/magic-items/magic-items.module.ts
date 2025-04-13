import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MagicItemsService } from './magic-items.service';
import { MagicItemsController } from './magic-items.controller';
import { MagicItem, MagicItemSchema } from './schemas/magic-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MagicItem.name, schema: MagicItemSchema },
    ]),
  ],
  controllers: [MagicItemsController],
  providers: [MagicItemsService],
})
export class MagicItemsModule {} 