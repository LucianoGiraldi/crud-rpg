import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MagicItem } from './schemas/magic-item.schema';
import { CreateMagicItemDto } from './dto/create-magic-item.dto';
import { UpdateMagicItemDto } from './dto/update-magic-item.dto';
import { ItemType } from './schemas/magic-item.schema';

@Injectable()
export class MagicItemsService {
  constructor(
    @InjectModel(MagicItem.name) private magicItemModel: Model<MagicItem>,
  ) {}

  async create(createMagicItemDto: CreateMagicItemDto): Promise<MagicItem> {
    // Validate item type constraints
    if (createMagicItemDto.type === ItemType.WEAPON && createMagicItemDto.defense !== 0) {
      throw new BadRequestException('Weapons must have 0 defense');
    }
    if (createMagicItemDto.type === ItemType.ARMOR && createMagicItemDto.strength !== 0) {
      throw new BadRequestException('Armor must have 0 strength');
    }
    if (createMagicItemDto.strength === 0 && createMagicItemDto.defense === 0) {
      throw new BadRequestException('Item must have at least one non-zero attribute');
    }

    const createdItem = new this.magicItemModel(createMagicItemDto);
    return createdItem.save();
  }

  async findAll(): Promise<MagicItem[]> {
    return this.magicItemModel.find().populate('character').exec();
  }

  async findOne(id: string): Promise<MagicItem> {
    const item = await this.magicItemModel.findById(id).populate('character').exec();
    if (!item) {
      throw new NotFoundException(`Magic item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateMagicItemDto: UpdateMagicItemDto): Promise<MagicItem> {
    const item = await this.magicItemModel.findById(id);
    if (!item) {
      throw new NotFoundException(`Magic item with ID ${id} not found`);
    }

    // Validate item type constraints for updates
    if (updateMagicItemDto.type === ItemType.WEAPON && updateMagicItemDto.defense !== 0) {
      throw new BadRequestException('Weapons must have 0 defense');
    }
    if (updateMagicItemDto.type === ItemType.ARMOR && updateMagicItemDto.strength !== 0) {
      throw new BadRequestException('Armor must have 0 strength');
    }
    if (updateMagicItemDto.strength === 0 && updateMagicItemDto.defense === 0) {
      throw new BadRequestException('Item must have at least one non-zero attribute');
    }

    const updatedItem = await this.magicItemModel
      .findByIdAndUpdate(id, updateMagicItemDto, { new: true })
      .populate('character')
      .exec();

    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.magicItemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Magic item with ID ${id} not found`);
    }
  }

  async findByCharacter(characterId: string): Promise<MagicItem[]> {
    return this.magicItemModel.find({ character: characterId }).exec();
  }
} 