import {Client, expect} from '@loopback/testlab';
import {PokedexApplication} from '../..';
import {setupApplication} from './test-helper';
import {FavouriteActions} from '../../controllers';
import {Pokemon} from '../../models';

describe('PokemonController', () => {
  let app: PokedexApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    app.bind('datasources.config.mongo').to({
      name: 'mongo',
      connector: 'mongodb',
      url: 'mongodb://pokemon:pokemon@localhost:27017/pokemon',
      host: 'localhost',
      port: '27018',
      user: 'pokemon',
      password: 'pokemon',
      database: 'pokemon',
      useNewUrlParser: true,
    });
  });

  after(async () => {
    await app.stop();
  });

  describe('invokes GET /pokemon', () => {
    it('returns the full list of pokemon', async () => {
      const res = await client.get('/pokemon').expect(200);
      expect(res.body).to.have.length(151);
    });

    it('returns a list of Pokemon with the given name', async () => {
      const res = await client.get('/pokemon?name=Bulbasaur').expect(200);
      expect(res.body).to.have.length(1);
    });

    it('returns a list of Pokemon with partial name', async () => {
      const partialName = 'saur';
      const res = await client.get(`/pokemon?name=${partialName}`).expect(200);
      expect(res.body).to.have.length(3);
      res.body.forEach((pokemon: Pokemon) => {
        expect(pokemon.name).to.containEql(partialName);
      });
    });

    it('returns a list of Pokemon with the given a type', async () => {
      const type = 'fire';
      const res = await client.get(`/pokemon?type=${type}`).expect(200);
      res.body.forEach((pokemon: Pokemon) => {
        expect(pokemon.types).to.have.containEql(type);
      });
    });

    it('returns a list of Pokemon with the given a type and name', async () => {
      const partialName = 'zard';
      const type = 'fire';
      const res = await client
        .get(`/pokemon?name=${partialName}&type=${type}`)
        .expect(200);
      res.body.forEach((pokemon: Pokemon) => {
        expect(pokemon.name).to.containEql(partialName);
        expect(pokemon.types).to.have.containEql(type);
      });
    });

    it('returns a list of favourite Pokemon', async () => {
      const favouritesPokemon = ['004', '59', '135'];
      await Promise.all(
        favouritesPokemon.map(pokemonId =>
          client.put(
            `/pokemon/${pokemonId}/favourite/${FavouriteActions.Mark}`,
          ),
        ),
      );
      const res = await client.get(`/pokemon?favourite=true`).expect(200);
      res.body.forEach((pokemon: Pokemon) => {
        expect(pokemon.favourite).to.be.true();
      });
    });

    it('returns a list of favourite Pokemon by name and type', async () => {
      const givenPokemon = {
        id: '006',
        name: 'Charizard',
        type: 'fire',
      };
      await client.put(
        `/pokemon/${givenPokemon.id}/favourite/${FavouriteActions.Mark}`,
      );
      const res = await client
        .get(
          `/pokemon?name=${givenPokemon.name}&type=${givenPokemon.type}&favourite=true`,
        )
        .expect(200);
      res.body.forEach((pokemon: Pokemon) => {
        expect(pokemon.name).to.containEql(givenPokemon.name);
        expect(pokemon.types).to.have.containEql(givenPokemon.type);
        expect(pokemon.favourite).to.be.true();
      });
    });

    it('returns the second 25 Pokemon at list', async () => {
      const page = 2;
      const limit = 25;
      const res = await client
        .get(`/pokemon?page=${page}&limit=${limit}`)
        .expect(200);
      expect(res.body).length(25);
      expect(res.body[0].id).to.eql('026');
    });

    it('the default list when page number is lower than 1', async () => {
      const page = 0;
      const limit = 25;
      const res = await client
        .get(`/pokemon?page=${page}&limit=${limit}`)
        .expect(200);
      expect(res.body).length(151);
    });
  });

  describe('invokes GET /pokemon/{id}', () => {
    it('returns the existent pokemon given an id', async () => {
      const pokemonId = '001';
      const res = await client.get(`/pokemon/${pokemonId}`).expect(200);
      expect(res.body.id).to.eql(pokemonId);
    });

    it('returns not found status given a non-existent pokemon id', async () => {
      const pokemonId = 'non-existent-id';
      await client.get(`/pokemon/${pokemonId}`).expect(404);
    });
  });

  describe('invokes GET /pokemon/name/{name}', () => {
    it('returns an existent pokemon given a name', async () => {
      const pokemonName = 'bulbasaur';
      const res = await client.get(`/pokemon/name/${pokemonName}`).expect(200);
      expect(res.body.name).to.eql('Bulbasaur');
    });

    it('returns an existent existent pokemon given a name with case sensitive ', async () => {
      const pokemonName = 'Bulbasaur';
      const res = await client.get(`/pokemon/name/${pokemonName}`).expect(200);
      expect(res.body.name).to.eql(pokemonName);
    });

    it('returns a not found status given a non existent pokemon name', async () => {
      const pokemonName = 'Non-Existent-Pokemon';
      await client.get(`/pokemon/name/${pokemonName}`).expect(404);
    });
  });

  describe('invokes PUT /pokemon/{id}/favourite/{action}', () => {
    it('mark the given pokemon as favourite', async () => {
      const pokemonId = '001';
      await client
        .put(`/pokemon/${pokemonId}/favourite/${FavouriteActions.Mark}`)
        .expect(204);
      const res = await client.get(`/pokemon/${pokemonId}`);
      expect(res.body.id).to.eql(pokemonId);
      expect(res.body.favourite).to.be.true();
    });

    it('unmark the given pokemon as favourite', async () => {
      const pokemonId = '001';
      await client
        .put(`/pokemon/${pokemonId}/favourite/${FavouriteActions.Unmark}`)
        .expect(204);
      const res = await client.get(`/pokemon/${pokemonId}`);
      expect(res.body.id).to.eql(pokemonId);
      expect(res.body.favourite).to.be.false();
    });

    it('returns not found error when the given pokemon not exists', async () => {
      const pokemonId = 'non-existent-id';
      await client
        .put(`/pokemon/${pokemonId}/favourite/${FavouriteActions.Mark}`)
        .expect(404);
    });

    it('returns not found error when the favourite action is not correct', async () => {
      const pokemonId = '001';
      await client
        .put(`/pokemon/${pokemonId}/favourite/non-existent-action`)
        .expect(404);
    });
  });

  describe('invokes GET /pokemon/types', () => {
    it('returns a list of the pokemon types', async () => {
      const res = await client.get('/pokemon/types').expect(200);
      expect(res.body).to.have.length(17);
    });
  });
});
