import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from './schemas/character.schema';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { MagicItem } from '../magic-items/schemas/magic-item.schema';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name) private characterModel: Model<Character>,
    @InjectModel(MagicItem.name) private magicItemModel: Model<MagicItem>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const { strength, defense } = createCharacterDto;
    
    if (strength + defense > 10) {
      throw new BadRequestException('Total de pontos de força e defesa não pode exceder 10');
    }

    const createdCharacter = new this.characterModel(createCharacterDto);
    return createdCharacter.save();
  }

  async findAll(): Promise<Character[]> {
    return this.characterModel.find().exec();
  }

  async findOne(id: string): Promise<Character> {
    const character = await this.characterModel.findById(id).exec();
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }
    return character;
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterModel.findById(id).exec();
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }

    if (updateCharacterDto.name) {
      character.name = updateCharacterDto.name;
    }

    return character.save();
  }

  async remove(id: string): Promise<Character> {
    const character = await this.characterModel.findById(id).exec();
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }
    return this.characterModel.findByIdAndDelete(id).exec();
  }

  async addMagicItem(characterId: string, magicItemId: string): Promise<Character> {
    const character = await this.characterModel.findById(characterId).exec();
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }

    const magicItem = await this.magicItemModel.findById(magicItemId).exec();
    if (!magicItem) {
      throw new NotFoundException('Item mágico não encontrado');
    }

    // Verificar se o personagem já possui um amuleto quando tentar adicionar outro
    if (magicItem.type === 'Amuleto') {
      const hasAmulet = character.magicItems.some(item => 
        item.toString() === magicItemId || 
        (item as any).type === 'Amuleto'
      );
      if (hasAmulet) {
        throw new BadRequestException('Personagem já possui um amuleto');
      }
    }

    // Verificar regras específicas para Armas e Armaduras
    if (magicItem.type === 'Arma' && magicItem.defense !== 0) {
      throw new BadRequestException('Armas devem ter defesa zero');
    }
    if (magicItem.type === 'Armadura' && magicItem.strength !== 0) {
      throw new BadRequestException('Armaduras devem ter força zero');
    }

    character.magicItems.push(magicItemId);
    return character.save();
  }

  async getCharacterMagicItems(characterId: string): Promise<MagicItem[]> {
    const character = await this.characterModel
      .findById(characterId)
      .populate('magicItems')
      .exec();
    
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }

    return character.magicItems as MagicItem[];
  }

  async removeMagicItem(characterId: string, magicItemId: string): Promise<Character> {
    const character = await this.characterModel.findById(characterId).exec();
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }

    const itemIndex = character.magicItems.indexOf(magicItemId);
    if (itemIndex === -1) {
      throw new NotFoundException('Item mágico não encontrado no personagem');
    }

    character.magicItems.splice(itemIndex, 1);
    return character.save();
  }

  async getCharacterAmulets(characterId: string): Promise<MagicItem[]> {
    const character = await this.characterModel
      .findById(characterId)
      .populate('magicItems')
      .exec();
    
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }

    return (character.magicItems as MagicItem[]).filter(item => item.type === 'Amuleto');
  }
} 