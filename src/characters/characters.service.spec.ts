import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { getModelToken } from '@nestjs/mongoose';
import { Character } from './schemas/character.schema';
import { MagicItem } from '../magic-items/schemas/magic-item.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CharactersService', () => {
  let service: CharactersService;
  let characterModel: any;
  let magicItemModel: any;

  const mockCharacter = {
    _id: 'character1',
    name: 'Test Character',
    adventurerName: 'TestAdventurer',
    class: 'Guerreiro',
    level: 1,
    strength: 5,
    defense: 5,
    magicItems: [],
  };

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
        CharactersService,
        {
          provide: getModelToken(Character.name),
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

    service = module.get<CharactersService>(CharactersService);
    characterModel = module.get(getModelToken(Character.name));
    magicItemModel = module.get(getModelToken(MagicItem.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a character successfully', async () => {
      const createCharacterDto = {
        name: 'Test Character',
        adventurerName: 'TestAdventurer',
        class: 'Guerreiro',
        strength: 5,
        defense: 5,
      };

      jest.spyOn(characterModel, 'create').mockImplementation(() => ({
        ...createCharacterDto,
        save: jest.fn().mockResolvedValue(mockCharacter),
      }));

      const result = await service.create(createCharacterDto);
      expect(result).toEqual(mockCharacter);
    });

    it('should throw BadRequestException when total points exceed 10', async () => {
      const createCharacterDto = {
        name: 'Test Character',
        adventurerName: 'TestAdventurer',
        class: 'Guerreiro',
        strength: 6,
        defense: 5,
      };

      await expect(service.create(createCharacterDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of characters', async () => {
      jest.spyOn(characterModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCharacter]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockCharacter]);
    });
  });

  describe('findOne', () => {
    it('should return a character by id', async () => {
      jest.spyOn(characterModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCharacter),
      });

      const result = await service.findOne('character1');
      expect(result).toEqual(mockCharacter);
    });

    it('should throw NotFoundException when character not found', async () => {
      jest.spyOn(characterModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMagicItem', () => {
    it('should add a magic item to character', async () => {
      jest.spyOn(characterModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCharacter),
      });

      jest.spyOn(magicItemModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMagicItem),
      });

      jest.spyOn(characterModel.prototype, 'save').mockResolvedValue({
        ...mockCharacter,
        magicItems: ['item1'],
      });

      const result = await service.addMagicItem('character1', 'item1');
      expect(result.magicItems).toContain('item1');
    });

    it('should throw NotFoundException when character not found', async () => {
      jest.spyOn(characterModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.addMagicItem('nonexistent', 'item1')).rejects.toThrow(NotFoundException);
    });
  });
}); 