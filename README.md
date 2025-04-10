# RPG Character Management System

A NestJS-based API for managing RPG characters and magic items.

## Features

- Character management (create, read, update, delete)
- Magic items management
- Character class system
- Item type system with specific rules
- Character-Item relationship management
- Swagger API documentation

## Requirements

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the application
npm run start:dev
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Character System

Characters have the following attributes:
- Name
- Adventurer Name
- Class (Guerreiro, Mago, Arqueiro, Ladino, Bardo)
- Level
- Strength (0-10)
- Defense (0-10)
- Magic Items

Total points for Strength and Defense cannot exceed 10.

## Magic Items System

Magic Items have the following attributes:
- Name
- Type (Arma, Armadura, Amuleto)
- Strength (0-10)
- Defense (0-10)

Rules:
- Weapons must have 0 defense
- Armor must have 0 strength
- Amulets can have both strength and defense
- Characters can only have one amulet
- Items must have at least one non-zero attribute

## API Endpoints

### Characters
- POST /characters - Create a character
- GET /characters - List all characters
- GET /characters/:id - Get character by ID
- PATCH /characters/:id - Update character
- DELETE /characters/:id - Delete character
- POST /characters/:id/items/:itemId - Add item to character
- DELETE /characters/:id/items/:itemId - Remove item from character
- GET /characters/:id/amulet - Get character's amulet

### Magic Items
- POST /magic-items - Create a magic item
- GET /magic-items - List all magic items
- GET /magic-items/:id - Get magic item by ID
- PATCH /magic-items/:id - Update magic item
- DELETE /magic-items/:id - Delete magic item
- GET /magic-items/character/:characterId - List character's items 