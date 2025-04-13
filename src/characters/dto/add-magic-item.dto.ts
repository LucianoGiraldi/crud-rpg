import { IsString, IsNotEmpty } from 'class-validator';

export class AddMagicItemDto {
  @IsString()
  @IsNotEmpty()
  magicItemId: string;
} 