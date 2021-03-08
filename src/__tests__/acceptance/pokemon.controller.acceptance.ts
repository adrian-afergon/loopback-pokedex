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

  describe('invoice PUT /pokemon/{id}/favourite/{action}', () => {
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
});
