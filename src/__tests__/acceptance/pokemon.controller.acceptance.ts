import {Client, expect} from '@loopback/testlab';
import {PokedexApplication} from '../..';
import {setupApplication} from './test-helper';

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
});
