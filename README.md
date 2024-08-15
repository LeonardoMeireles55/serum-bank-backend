# serum-bank api

### Tecnologias

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

### Descrição

RESTful API que permite o acesso de rotas privadas e públicas para aplicativo web openSerumBank.

### Passos para rodar o projeto:

#### Instale as dependencias

abra o terminal e rode os comandos:

```bash
npm install
```

#### Criando variaveis de ambiete

Crie um arquivo .env na raiz do projeto seguindo o template abaixo:

#### Email Configuration

- EMAIL_HOST=smtp.gmail.com
- EMAIL_USER=leo@email.com
- EMAIL_PASS=xxsaZAE2x

#### Database Configuration

- DB_HOST=localhost
- DB_PORT=5432
- DB_USERNAME=root
- DB_PASSWORD=root
- DB_DATABASE=postgres
- DB_DATABASE_TEST=postgres

#### Node Environment

- NODE_ENV=development
- APP_PORT=3000

#### JWT Secret

- JWT_SECRET=secretKey
- JWT_EXPIRES_IN=1800s

#### Comando para rodar testes

```bash
npx jest
```

#### Comandos para rodar o projeto

abra o terminal e rode esses comandos:

- subir container com banco de dados

```bash
docker compose up
```

- rodar aplicação nestjs

```bash
npm run start
```

#### Usuario padrão

- email: admin@admin.com
- senha: admin

#### Documentação

Para vizualizar documentaçao das rotas acesse:

```
http://localhost:3000/api#/
```
