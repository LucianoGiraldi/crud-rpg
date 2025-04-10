import { IsString, IsEnum, IsInt, Min, Max, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CharacterClass } from '../schemas/character.schema';

export class CreateCharacterDto {
  @ApiProperty({ description: 'Character name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Adventurer name' })
  @IsString()
  adventurerName: string;

  @ApiProperty({ enum: CharacterClass, description: 'Character class' })
  @IsEnum(CharacterClass)
  class: CharacterClass;

  @ApiProperty({ description: 'Character level', default: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({ description: 'Character strength (0-10)', minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  strength: number;

  @ApiProperty({ description: 'Character defense (0-10)', minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  defense: number;
} 