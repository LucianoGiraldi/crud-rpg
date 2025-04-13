import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = app.get('DatabaseConnection');
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  describe('Characters', () => {
    let characterId: string;

    it('/characters (POST) - should create a character', () => {
      return request(app.getHttpServer())
        .post('/characters')
        .send({
          name: 'Test Character',
          adventurerName: 'TestAdventurer',
          class: 'Guerreiro',
          strength: 5,
          defense: 5,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.name).toBe('Test Character');
          characterId = res.body._id;
        });
    });

    it('/characters (GET) - should return all characters', () => {
      return request(app.getHttpServer())
        .get('/characters')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/characters/:id (GET) - should return a character by id', () => {
      return request(app.getHttpServer())
        .get(`/characters/${characterId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(characterId);
        });
    });
  });

  describe('Magic Items', () => {
    let magicItemId: string;

    it('/magic-items (POST) - should create a weapon', () => {
      return request(app.getHttpServer())
        .post('/magic-items')
        .send({
          name: 'Test Weapon',
          type: 'Arma',
          strength: 3,
          defense: 0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.type).toBe('Arma');
          magicItemId = res.body._id;
        });
    });

    it('/magic-items (POST) - should create an armor', () => {
      return request(app.getHttpServer())
        .post('/magic-items')
        .send({
          name: 'Test Armor',
          type: 'Armadura',
          strength: 0,
          defense: 3,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.type).toBe('Armadura');
        });
    });

    it('/magic-items (GET) - should return all magic items', () => {
      return request(app.getHttpServer())
        .get('/magic-items')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/magic-items/:id (GET) - should return a magic item by id', () => {
      return request(app.getHttpServer())
        .get(`/magic-items/${magicItemId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(magicItemId);
        });
    });
  });

  describe('Character Magic Items', () => {
    let characterId: string;
    let magicItemId: string;

    beforeEach(async () => {
      // Create a character
      const characterResponse = await request(app.getHttpServer())
        .post('/characters')
        .send({
          name: 'Test Character',
          adventurerName: 'TestAdventurer',
          class: 'Guerreiro',
          strength: 5,
          defense: 5,
        });
      characterId = characterResponse.body._id;

      // Create a magic item
      const magicItemResponse = await request(app.getHttpServer())
        .post('/magic-items')
        .send({
          name: 'Test Weapon',
          type: 'Arma',
          strength: 3,
          defense: 0,
        });
      magicItemId = magicItemResponse.body._id;
    });

    it('/characters/:id/magic-items (POST) - should add magic item to character', () => {
      return request(app.getHttpServer())
        .post(`/characters/${characterId}/magic-items`)
        .send({ magicItemId })
        .expect(201)
        .expect((res) => {
          expect(res.body.magicItems).toContain(magicItemId);
        });
    });

    it('/characters/:id/magic-items (GET) - should return character magic items', () => {
      return request(app.getHttpServer())
        .get(`/characters/${characterId}/magic-items`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/characters/:id/magic-items/:magicItemId (DELETE) - should remove magic item from character', () => {
      return request(app.getHttpServer())
        .delete(`/characters/${characterId}/magic-items/${magicItemId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.magicItems).not.toContain(magicItemId);
        });
    });
  });
}); 