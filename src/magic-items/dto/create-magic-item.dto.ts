import { IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemType } from '../schemas/magic-item.schema';

export class CreateMagicItemDto {
  @ApiProperty({ description: 'Magic item name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ItemType, description: 'Type of magic item' })
  @IsEnum(ItemType)
  type: ItemType;

  @ApiProperty({ description: 'Item strength (0-10)', minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  strength: number;

  @ApiProperty({ description: 'Item defense (0-10)', minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  defense: number;
} 