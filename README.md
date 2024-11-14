<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">Projeto desenvolvido como parte do Desafio Profissional do 2º bimestre.</p>

## Descrição

Aplicação para gerenciamento de baralhos de Magic: The Gathering (formato Commander) utilizando o framework [Nest.js](https://nestjs.com/). O projeto permite a criação e gestão de múltiplos baralhos por jogador, cacheamento de rotas e importação de baralhos via JSON.

## Funcionalidades

1. Criação de múltiplos baralhos.
2. Rota para listar todos os baralhos (acessível apenas para usuários com permissão de administrador).
3. Rota para listar os baralhos do jogador logado.
4. Implementação de cache para melhorar a performance na listagem de baralhos do jogador logado.
5. Importação de baralhos via arquivo JSON, com validação das regras do formato Commander.
6. Testes de performance com comparativos entre as listagens com e sem cache.

### Pontos Extras
- Implementação de clusters na aplicação e análise de performance.
- Uso de Node.js streams para consumir a API de Magic e também a própria API.
- Front-end para a aplicação.

## Instalação

```bash
$ npm install
```

## Executando a Aplicação

```bash
# Desenvolvimento
$ npm run start

# Modo de observação
$ npm run start:dev

# Modo de produção
$ npm run start:prod
```

## Testes

```bash
# Testes unitários
$ npm run test

# Testes de ponta a ponta (e2e)
$ npm run test:e2e

# Cobertura de testes
$ npm run test:cov
```

## Documentação Adicional

	•	Cacheamento no Nest.js
	•	Uso de Streams no Node.js
	•	Validação de baralhos no formato Commander

## Suporte

Projeto realizado com suporte do framework Nest.js, licenciado sob a licença MIT.

## Contribuidores

Este projeto foi desenvolvido por Pedro Gomes (RA: 22087525-2) e Eduardo Voltatone (RA: 22207439-2). Cada membro contribuiu com commits relevantes para a implementação de funcionalidades.

## Licença
Este projeto é licenciado sob a [Licença MIT](./LICENSE).
