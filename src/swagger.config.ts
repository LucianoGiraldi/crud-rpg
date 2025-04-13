import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('RPG Character Management API')
  .setDescription(`
    API para gerenciamento de personagens e itens mágicos de RPG.
    
    ## Funcionalidades Principais
    
    ### Personagens
    - Criação de personagens com distribuição de pontos entre força e defesa
    - Gerenciamento de atributos e nível
    - Sistema de classes (Guerreiro, Mago, Arqueiro, Ladino, Bardo)
    - Vinculação com itens mágicos
    
    ### Itens Mágicos
    - Diferentes tipos (Arma, Armadura, Amuleto)
    - Sistema de atributos (força e defesa)
    - Regras específicas por tipo de item
    - Vinculação com personagens
    
    ## Regras de Negócio
    
    ### Personagens
    - 10 pontos para distribuir entre força e defesa
    - Classe fixa após criação
    - Level inicial 1
    
    ### Itens Mágicos
    - Armas: defesa sempre zero
    - Armaduras: força sempre zero
    - Amuletos: podem ter força e defesa
    - Máximo de 1 amuleto por personagem
    - Valores de força e defesa não podem exceder 10
  `)
  .setVersion('1.0')
  .addTag('characters', 'Endpoints relacionados a personagens')
  .addTag('magic-items', 'Endpoints relacionados a itens mágicos')
  .addBearerAuth()
  .build(); 