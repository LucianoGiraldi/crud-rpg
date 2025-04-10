import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CharactersModule } from './characters/characters.module';
import { MagicItemsModule } from './magic-items/magic-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/rpg-system'),
    CharactersModule,
    MagicItemsModule,
  ],
})
export class AppModule {} 