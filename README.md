# Sistema de Gerenciamento de RPG

Sistema para gerenciamento de personagens e itens mágicos de RPG, desenvolvido com NestJS e MongoDB.

## Funcionalidades

- Gerenciamento completo de personagens
- Sistema de itens mágicos
- Distribuição de pontos entre força e defesa
- Diferentes classes de personagens
- Sistema de níveis
- Documentação completa via Swagger

## Requisitos

- Node.js (v14 ou superior)
- MongoDB (v4.4 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/LucianoGiraldi/crud-rpg.git
cd crud-rpg
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo .env com suas configurações.

4. Inicie o MongoDB:
```bash
# Certifique-se de que o MongoDB está rodando em sua máquina
```

5. Execute as migrações (se houver):
```bash
npm run migration:run
# ou
yarn migration:run
```

6. Inicie o servidor:
```bash
# Desenvolvimento
npm run start:dev
# ou
yarn start:dev

# Produção
npm run start:prod
# ou
yarn start:prod
```

## Documentação da API

A documentação completa da API está disponível via Swagger em:
```
http://localhost:3000/api
```

## Endpoints Principais

### Personagens

- `POST /characters` - Criar novo personagem
- `GET /characters` - Listar todos os personagens
- `GET /characters/:id` - Buscar personagem por ID
- `PUT /characters/:id` - Atualizar personagem
- `DELETE /characters/:id` - Remover personagem
- `POST /characters/:id/magic-items` - Adicionar item mágico ao personagem
- `GET /characters/:id/magic-items` - Listar itens mágicos do personagem
- `DELETE /characters/:id/magic-items/:magicItemId` - Remover item mágico do personagem
- `GET /characters/:id/amulets` - Buscar amuletos do personagem

### Itens Mágicos

- `POST /magic-items` - Criar novo item mágico
- `GET /magic-items` - Listar todos os itens mágicos
- `GET /magic-items/:id` - Buscar item mágico por ID

## Regras de Negócio

### Personagens

- 10 pontos para distribuir entre força e defesa
- Classe fixa após criação
- Level inicial 1
- Classes disponíveis: Guerreiro, Mago, Arqueiro, Ladino, Bardo

### Itens Mágicos

- Tipos: Arma, Armadura, Amuleto
- Armas: defesa sempre zero
- Armaduras: força sempre zero
- Amuletos: podem ter força e defesa
- Máximo de 1 amuleto por personagem
- Valores de força e defesa não podem exceder 10

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 
