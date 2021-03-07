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

  it('invokes GET /pokemon', async () => {
    const res = await client.get('/pokemon').expect(200);
    expect(res.body).to.have.length(151);
  });

  it('invokes GET /pokemon/{id} existent pokemon id', async () => {
    const pokemonId = '001';
    const res = await client.get(`/pokemon/${pokemonId}`).expect(200);
    expect(res.body.id).to.eql(pokemonId);
  });

  it('invokes GET /pokemon/{id} with non-existent pokemon id', async () => {
    const pokemonId = 'non-existent-id';
    await client.get(`/pokemon/${pokemonId}`).expect(404);
  });
});
