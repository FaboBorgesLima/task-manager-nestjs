# Task Manager API

## Description (from wiki)

This application is a simple task manager that will use react-native for a mobile app, nest-js for back-end and maybe some nuxt (or next) for a web application.

This project was developed for educational purposes.

I hope you enjoy it

## Quick Start

```bash
# Clone the repository
git clone git@github.com:FaboBorgesLima/task-manager-nestjs.git
```

```bash
# Go to the project directory
cd task-manager-nestjs
```

```bash
# Install dependencies
npm install
```

```bash
# run the application on docker
docker-compose up -d
```

## Details

most details about the project, like data modeling and screen prototypes, can be found in the wiki.

- [Wiki](https://github.com/FaboBorgesLima/task-manager-nestjs/wiki)

## Checklist

- [x] **RA1 - Projetar e desenvolver uma API funcional utilizando o framework NestJS.**

  - [x] **ID1:** Configurar corretamente o ambiente de desenvolvimento e criar a API utilizando NestJS, com rotas e controladores que seguem a arquitetura modular.
  - [x] **ID2:**~~ Aplicar boas práticas de organização da lógica de negócios, garantindo que os services contenham a lógica de negócio e sejam chamados pelos controladores, separando responsabilidades corretamente.~~ A lógica de negócio foi isolada na camada de dominio, assim services e controladores não possuem lógica de negocio, apenas chamam a camada de dominio. Garantindo assim que a lógica de negocio possa ser reutilizada em outros contextos, como em aplicações web, mobile ou desktop.
  - [x] **ID3:** Utilizar providers e configurar adequadamente a injeção de dependência no NestJS, garantindo uma arquitetura modular e escalável.
  - [x] **ID4:** Demonstrar habilidade de criar e manipular rotas HTTP, manipulando parâmetros de rota, query e body, lidando corretamente com requisições e respostas.
  - [x] **ID5:** Aplicar boas práticas de tratamento de erros, utilizando filtros globais e personalizando as mensagens de erro para garantir respostas claras e consistentes.
  - [x] **ID6:** Criar classes DTO (Data Transfer Objects) para garantir a validação e consistência dos dados em diferentes endpoints, utilizando pipes para validar entradas de dados.
  - [x] **ID7:** Aplicar corretamente pipes de validação no NestJS, verificando entradas inválidas e assegurando a integridade dos dados transmitidos.

- [x] **RA2 - Implementar persistência de dados com um banco de dados relacional utilizando Prisma ou TypeORM.**

  - [x] **ID8:** Modelar corretamente os dados da aplicação, definindo entidades, suas relações e campos necessários, refletidos em um Diagrama de Entidade-Relacionamento (ERD).
  - [x] **ID9:** Configurar e conectar a API a um banco de dados relacional (PostgreSQL, MySQL, etc.) utilizando Prisma ou TypeORM.
  - [x] **ID10:** Criar e aplicar migrações de banco de dados para garantir a consistência dos dados entre desenvolvimento e produção.
  - [x] **ID11:** Implementar corretamente as operações CRUD (Create, Read, Update, Delete) para pelo menos uma entidade no projeto, utilizando NestJS.

- [x] **RA3 - Realizar testes automatizados para garantir a qualidade da API.**

  - [x] **ID12:** Implementar testes automatizados (unitários ou de integração) utilizando Jest, validando funcionalidades críticas da API.
  - [x] **ID13:** Garantir a cobertura de testes para, pelo menos, as principais rotas e serviços da API, incluindo operações CRUD.

- [ ] **RA4 - Gerar a documentação da API e realizar o deploy em um ambiente de produção.**

  - [x] **ID14:** Integrar corretamente o Swagger à API, gerando a documentação completa e interativa dos endpoints, parâmetros e respostas da API, com exemplos de requisições e respostas.
  - [ ] **ID15:** Realizar o deploy da API em uma plataforma de hospedagem na nuvem (ex.: Render.com, Heroku, Vercel, etc.), garantindo que a API esteja acessível publicamente.
  - [x] **ID16:** Garantir que a API funcione corretamente no ambiente de produção, incluindo a documentação Swagger e o banco de dados.
  - [x] **ID17:** Realizar a configuração correta de variáveis de ambiente usando o ConfigModule do NestJS.
  - [ ] **ID18:** Implementar corretamente o versionamento de APIs REST no NestJS, assegurando que diferentes versões da API possam coexistir.

- [ ] **RA5 - Implementar autenticação, autorização e segurança em APIs utilizando JWT, Guards, Middleware e Interceptadores.**
  - [x] **ID19:** Configurar a autenticação na API utilizando JWT (JSON Web Tokens).
  - [ ] **ID20:** Implementar controle de acesso baseado em roles e níveis de permissão, utilizando Guards para verificar permissões em rotas específicas.
  - [x] **ID21:** Configurar e utilizar middleware para manipular requisições antes que elas cheguem aos controladores, realizando tarefas como autenticação, logging ou tratamento de CORS.
  - [x] **ID22:** Implementar interceptadores para realizar logging ou modificar as respostas antes de enviá-las ao cliente.
