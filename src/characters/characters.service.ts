import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from './schemas/character.schema';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { MagicItem } from '../magic-items/schemas/magic-item.schema';
import { ItemType } from '../magic-items/schemas/magic-item.schema';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name) private characterModel: Model<Character>,
    @InjectModel(MagicItem.name) private magicItemModel: Model<MagicItem>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const totalPoints = createCharacterDto.strength + createCharacterDto.defense;
    if (totalPoints > 10) {
      throw new BadRequestException('Total points for strength and defense cannot exceed 10');
    }

    const createdCharacter = new this.characterModel(createCharacterDto);
    return createdCharacter.save();
  }

  async findAll(): Promise<Character[]> {
    return this.characterModel.find().populate('magicItems').exec();
  }

  async findOne(id: string): Promise<Character> {
    const character = await this.characterModel.findById(id).populate('magicItems').exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    return character;
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    if (updateCharacterDto.strength !== undefined && updateCharacterDto.defense !== undefined) {
      const totalPoints = updateCharacterDto.strength + updateCharacterDto.defense;
      if (totalPoints > 10) {
        throw new BadRequestException('Total points for strength and defense cannot exceed 10');
      }
    }

    const updatedCharacter = await this.characterModel
      .findByIdAndUpdate(id, updateCharacterDto, { new: true })
      .populate('magicItems')
      .exec();

    if (!updatedCharacter) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return updatedCharacter;
  }

  async remove(id: string): Promise<void> {
    const result = await this.characterModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
  }

  async addMagicItem(characterId: string, magicItemId: string): Promise<Character> {
    const character = await this.characterModel.findById(characterId);
    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    const magicItem = await this.magicItemModel.findById(magicItemId);
    if (!magicItem) {
      throw new NotFoundException(`Magic item with ID ${magicItemId} not found`);
    }

    // Check if character already has an amulet when adding a new amulet
    if (magicItem.type === ItemType.AMULET) {
      const existingAmulet = await this.magicItemModel.findOne({
        character: characterId,
        type: ItemType.AMULET,
      });
      if (existingAmulet) {
        throw new BadRequestException('Character already has an amulet');
      }
    }

    magicItem.character = characterId;
    await magicItem.save();

    if (!character.magicItems.includes(magicItemId)) {
      character.magicItems.push(magicItemId);
      await character.save();
    }

    return this.characterModel.findById(characterId).populate('magicItems').exec();
  }

  async removeMagicItem(characterId: string, magicItemId: string): Promise<Character> {
    const character = await this.characterModel.findById(characterId);
    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    const magicItem = await this.magicItemModel.findById(magicItemId);
    if (!magicItem) {
      throw new NotFoundException(`Magic item with ID ${magicItemId} not found`);
    }

    if (magicItem.character?.toString() !== characterId) {
      throw new BadRequestException('Magic item is not owned by this character');
    }

    magicItem.character = null;
    await magicItem.save();

    character.magicItems = character.magicItems.filter(
      (itemId) => itemId.toString() !== magicItemId,
    );
    await character.save();

    return this.characterModel.findById(characterId).populate('magicItems').exec();
  }

  async getCharacterAmulet(characterId: string): Promise<MagicItem | null> {
    const character = await this.characterModel.findById(characterId);
    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    return this.magicItemModel.findOne({
      character: characterId,
      type: ItemType.AMULET,
    });
  }
} 