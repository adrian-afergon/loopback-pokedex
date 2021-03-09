# loopback-pokedex

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Environment variables

First you will need to define your environment variables. For a development proposal you can create a `.env` file with the following structure:
```
# MONGO_DEFINITION
MONGO_INITDB_DATABASE= #database name 
MONGO_INITDB_ROOT_USERNAME= #root username
MONGO_INITDB_ROOT_PASSWORD= #root password

# MONGO_REMOTE_CONNECTION
MONGODB_URL= #url to connect to the database
MONGODB_HOST= #host to connect to the database
MONGODB_PORT= #database port
MONGODB_USER= #username for connection to the database
MONGODB_PASSWORD= #password for connection to the database
MONGODB_DATABASE= #databa name
```

or you can execute a copy of the sample:
```
cp .env.sample .env
```

## Pre-requisites
To run this project successfully you will need to have docker-compose installed. To make it works you only need to execute the folowing command:
```
docker-compose up
```
It will deploy the *database* with the defined list of pokemons at `./data.pokemon.json` and runs the *application*.
If you want to skip the application at `docker-compose`, you can also run:
```
docker-compose up mongoimport database
```

**IMPORTANT:** Keep in mind that the current database has a default configuration, so if you want to use it on production you must reconfigure it, enable authentication and change the default username and password.

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
