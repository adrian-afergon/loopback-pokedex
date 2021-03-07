import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
  HttpErrors,
  put,
} from '@loopback/rest';
import {Pokemon} from '../models';
import {PokemonRepository} from '../repositories';

export enum FavouriteActions {
  Mark = 'mark',
  Unmark = 'unmark',
}

export class PokemonController {
  constructor(
    @repository(PokemonRepository)
    public pokemonRepository: PokemonRepository,
  ) {}

  @get('/pokemon')
  @response(200, {
    description: 'Array of Pokemon model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pokemon, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Pokemon) filter?: Filter<Pokemon>,
  ): Promise<Pokemon[]> {
    return this.pokemonRepository.find(filter);
  }

  @get('/pokemon/{id}')
  @response(200, {
    description: 'Pokemon model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pokemon, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Pokemon, {exclude: 'where'})
    filter?: FilterExcludingWhere<Pokemon>,
  ): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({where: {id}});
    if (pokemon) {
      return pokemon;
    } else {
      throw new HttpErrors.NotFound();
    }
  }

  @get('/pokemon/name/{name}')
  @response(200, {
    description: 'Pokemon model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pokemon, {includeRelations: true}),
      },
    },
  })
  async findByName(
    @param.path.string('name') name: string,
    @param.filter(Pokemon, {exclude: 'where'})
    filter?: FilterExcludingWhere<Pokemon>,
  ): Promise<Pokemon> {
    const nameInsensitiveCase = new RegExp(name, 'i');
    const pokemon = await this.pokemonRepository.findOne({
      where: {name: {like: nameInsensitiveCase}},
    });
    if (pokemon) {
      return pokemon;
    } else {
      throw new HttpErrors.NotFound();
    }
  }

  @put('/pokemon/{id}/favourite/{action}')
  @response(204, {
    description: 'Pokemon PUT success',
  })
  async markAsFavouriteById(
    @param.path.string('id') id: string,
    @param.path.string('action') action: FavouriteActions,
  ): Promise<void> {
    if (
      action !== FavouriteActions.Mark &&
      action !== FavouriteActions.Unmark
    ) {
      throw new HttpErrors.NotFound();
    }
    const pokemon = await this.pokemonRepository.findOne({where: {id}});
    // we handle it in two difference conditions in order to improve the performance
    if (!pokemon) {
      throw new HttpErrors.NotFound();
    }
    await this.pokemonRepository.update(
      new Pokemon({
        ...pokemon,
        favourite: Boolean(action === FavouriteActions.Mark),
      }),
    );
  }
}
