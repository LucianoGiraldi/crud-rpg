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
    const { type, strength, defense } = createMagicItemDto;

    // Validar regras específicas para cada tipo de item
    if (type === 'Arma' && defense !== 0) {
      throw new BadRequestException('Armas devem ter defesa zero');
    }
    if (type === 'Armadura' && strength !== 0) {
      throw new BadRequestException('Armaduras devem ter força zero');
    }

    // Validar valores máximos
    if (strength > 10 || defense > 10) {
      throw new BadRequestException('Valores de força e defesa não podem exceder 10');
    }

    // Validar que não pode ter força e defesa zero
    if (strength === 0 && defense === 0) {
      throw new BadRequestException('Item não pode ter força e defesa zero');
    }

    const createdMagicItem = new this.magicItemModel(createMagicItemDto);
    return createdMagicItem.save();
  }

  async findAll(): Promise<MagicItem[]> {
    return this.magicItemModel.find().exec();
  }

  async findOne(id: string): Promise<MagicItem> {
    const magicItem = await this.magicItemModel.findById(id).exec();
    if (!magicItem) {
      throw new NotFoundException('Item mágico não encontrado');
    }
    return magicItem;
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