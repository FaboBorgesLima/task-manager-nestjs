# Quick start

## Dependencies

- docker
- docker-compose
- node v22.x

## Running the project

1. Clone the repository

```bash
git clone https://github.com/FaboBorgesLima/task-manager-nestjs.git
```

2. Navigate into the project directory

```bash
cd task-manager-nestjs
```

3. Install dependencies

```bash
npm install
```

4. Start the application

```bash
docker compose up
```

5. Access the application

```bash
http://localhost:3000
```

## Running tests

This project uses Jest for testing. You can run the tests using the following commands:

1. for unit testing:

```bash
npm run test
```

2. for e2e testing (you need to have the docker compose running):

```bash
docker compose run --rm server npm run test:e2e
```
