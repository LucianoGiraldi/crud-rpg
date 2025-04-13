import { Test, TestingModule } from '@nestjs/testing';
import { MagicItemsService } from './magic-items.service';
import { getModelToken } from '@nestjs/mongoose';
import { MagicItem } from './schemas/magic-item.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MagicItemsService', () => {
  let service: MagicItemsService;
  let magicItemModel: any;

  const mockMagicItem = {
    _id: 'item1',
    name: 'Test Item',
    type: 'Arma',
    strength: 3,
    defense: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MagicItemsService,
        {
          provide: getModelToken(MagicItem.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MagicItemsService>(MagicItemsService);
    magicItemModel = module.get(getModelToken(MagicItem.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a weapon successfully', async () => {
      const createMagicItemDto = {
        name: 'Test Weapon',
        type: 'Arma',
        strength: 3,
        defense: 0,
      };

      jest.spyOn(magicItemModel, 'create').mockImplementation(() => ({
        ...createMagicItemDto,
        save: jest.fn().mockResolvedValue(mockMagicItem),
      }));

      const result = await service.create(createMagicItemDto);
      expect(result).toEqual(mockMagicItem);
    });

    it('should create an armor successfully', async () => {
      const createMagicItemDto = {
        name: 'Test Armor',
        type: 'Armadura',
        strength: 0,
        defense: 3,
      };

      const mockArmor = { ...mockMagicItem, type: 'Armadura', strength: 0, defense: 3 };

      jest.spyOn(magicItemModel, 'create').mockImplementation(() => ({
        ...createMagicItemDto,
        save: jest.fn().mockResolvedValue(mockArmor),
      }));

      const result = await service.create(createMagicItemDto);
      expect(result).toEqual(mockArmor);
    });

    it('should throw BadRequestException when weapon has non-zero defense', async () => {
      const createMagicItemDto = {
        name: 'Test Weapon',
        type: 'Arma',
        strength: 3,
        defense: 1,
      };

      await expect(service.create(createMagicItemDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when armor has non-zero strength', async () => {
      const createMagicItemDto = {
        name: 'Test Armor',
        type: 'Armadura',
        strength: 1,
        defense: 3,
      };

      await expect(service.create(createMagicItemDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when both strength and defense are zero', async () => {
      const createMagicItemDto = {
        name: 'Test Item',
        type: 'Amuleto',
        strength: 0,
        defense: 0,
      };

      await expect(service.create(createMagicItemDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of magic items', async () => {
      jest.spyOn(magicItemModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockMagicItem]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockMagicItem]);
    });
  });

  describe('findOne', () => {
    it('should return a magic item by id', async () => {
      jest.spyOn(magicItemModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMagicItem),
      });

      const result = await service.findOne('item1');
      expect(result).toEqual(mockMagicItem);
    });

    it('should throw NotFoundException when magic item not found', async () => {
      jest.spyOn(magicItemModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
}); 