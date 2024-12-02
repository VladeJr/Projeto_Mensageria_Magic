<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">Projeto desenvolvido como parte do Desafio Profissional do 2º bimestre.</p>

## Descrição

Este projeto implementa uma API para gerenciar baralhos de Magic: The Gathering com suporte a importação assíncrona de baralhos, filas de mensagens usando RabbitMQ, e notificações em tempo real via WebSockets.

## Requisitos
Node.js versão 16+
Docker e Docker Compose
RabbitMQ
MongoDB

## Configuração e Instalação
Clone o Repositório:
bash
git clone <Projeto_Mensageria_Magic.git>
cd <Projeto_Mensageria_Magic>

## Configure o Ambiente:

Crie um arquivo .env baseado no .env.example fornecido.
env
RABBITMQ_URL=amqp://user:password@localhost:5672
MONGO_URL=mongodb://localhost:27017/project_card_game
Suba os Serviços: Use Docker para rodar RabbitMQ e MongoDB:
bash
docker-compose up -d

## Instale Dependências:

bash

npm install

## Inicie o Servidor:

bash

npm run start:dev

## Arquitetura do Sistema
RabbitMQ:
Fila deck_import_queue: Processa requisições de importação de baralhos.
Fila deck_updates_queue: Gerencia notificações de atualizações.

## WebSockets:
Gateway para notificar clientes sobre atualizações em tempo real.

## MongoDB:
Banco de dados para armazenamento de baralhos e cartas.

## Uso
Importar Baralho:
Fazer uma requisição para o endpoint /enqueueImportDeck.
A API valida o baralho e envia uma mensagem para o RabbitMQ.

## Notificações em Tempo Real:
Clientes conectados via WebSocket recebem notificações de eventos.

## Painel RabbitMQ:
Acesse http://localhost:15672.
Login: user | Senha: password

## Importar Baralho
POST /cards/enqueueImportDeck
Body:
json
{
  "cards": [
    { "name": "Test Card 1", "type": "Legendary Creature" },
    { "name": "Test Card 2", "type": "Creature" },
    ...
  ]
}

## Consultar Cartas
GET /cards
GET /cards/:id
Criar Carta
POST /cards
Body:
json
{
  "name": "Test Card",
  "type": "Creature",
  "mana": "1G",
  "power": "2",
  "toughness": "2"
}

## Monitoramento e Logs
Monitoramento de Filas:
Use o painel RabbitMQ para verificar mensagens e filas.

## Logs:
Logs centralizados pelo LoggingService:
Logs de consumo e envio de mensagens.
Logs de eventos WebSocket.

## Testes
Executar Testes:

bash

npm run test

## Cobertura de Testes:
Inclui testes unitários para:
Serviços (RabbitMQ, Cards, Notifications).
Workers (DeckImportWorker, NotificationsWorker).

## Funcionalidades

1. Criação de múltiplos baralhos.
2. Rota para listar todos os baralhos (acessível apenas para usuários com permissão de administrador).
3. Rota para listar os baralhos do jogador logado.
4. Implementação de cache para melhorar a performance na listagem de baralhos do jogador logado.
5. Importação de baralhos via arquivo JSON, com validação das regras do formato Commander.
6. Testes de performance com comparativos entre as listagens com e sem cache.
7. Mensageria com RabbitMQ
8. Notificações em Tempo Real
9. Logs Centralizados
10. Painel de Monitoramento do Rabbit

### Pontos Extras
- Implementação de clusters na aplicação e análise de performance.
- Uso de Node.js streams para consumir a API de Magic e também a própria API.
- Front-end para a aplicação.

## Suporte

Projeto realizado com suporte do framework Nest.js, licenciado sob a licença MIT.

## Contribuidores

Este projeto foi desenvolvido por Vlademir Vinhoto Junior (RA: 22014195-2), João Paulo de Andrade Gonçalves (RA: 22012646-2), Pedro Gomes (RA: 22087525-2), Eduardo Voltatone (RA: 22207439-2) e Lucas Leal Cardoso
(RA: 22015777-2). 

## Licença
Este projeto é licenciado sob a [Licença MIT](./LICENSE).
