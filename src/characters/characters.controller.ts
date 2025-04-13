import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { AddMagicItemDto } from './dto/add-magic-item.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  async create(@Body() createCharacterDto: CreateCharacterDto) {
    try {
      return await this.charactersService.create(createCharacterDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.charactersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.charactersService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCharacterDto: UpdateCharacterDto) {
    try {
      return await this.charactersService.update(id, updateCharacterDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.charactersService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post(':id/magic-items')
  async addMagicItem(@Param('id') id: string, @Body() addMagicItemDto: AddMagicItemDto) {
    try {
      return await this.charactersService.addMagicItem(id, addMagicItemDto.magicItemId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/magic-items')
  async getCharacterMagicItems(@Param('id') id: string) {
    try {
      return await this.charactersService.getCharacterMagicItems(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':characterId/magic-items/:magicItemId')
  async removeMagicItem(
    @Param('characterId') characterId: string,
    @Param('magicItemId') magicItemId: string,
  ) {
    try {
      return await this.charactersService.removeMagicItem(characterId, magicItemId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/amulets')
  async getCharacterAmulets(@Param('id') id: string) {
    try {
      return await this.charactersService.getCharacterAmulets(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
} 