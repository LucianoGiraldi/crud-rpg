import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MagicItemsService } from './magic-items.service';
import { CreateMagicItemDto } from './dto/create-magic-item.dto';

@Controller('magic-items')
export class MagicItemsController {
  constructor(private readonly magicItemsService: MagicItemsService) {}

  @Post()
  async create(@Body() createMagicItemDto: CreateMagicItemDto) {
    try {
      return await this.magicItemsService.create(createMagicItemDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.magicItemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.magicItemsService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
} 