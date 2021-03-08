import {EntityNotFoundError, FilterExcludingWhere} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
  HttpErrors,
  put,
} from '@loopback/rest';
import {Pokemon} from '../models';
import {service} from '@loopback/core';
import {PokemonService} from '../services';

export enum FavouriteActions {
  Mark = 'mark',
  Unmark = 'unmark',
}

export class PokemonController {
  constructor(
    @service(PokemonService)
    public pokemonService: PokemonService,
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
    @param.query.string('name') name?: string,
  ): Promise<Pokemon[]> {
    return this.pokemonService.findAll({name});
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
    try {
      return await this.pokemonService.findById(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpErrors.NotFound();
      } else {
        throw new HttpErrors.InternalServerError();
      }
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
    try {
      return await this.pokemonService.findByName(name);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpErrors.NotFound();
      } else {
        throw new HttpErrors.InternalServerError();
      }
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
    try {
      if (action === FavouriteActions.Mark) {
        await this.pokemonService.markFavourite(id);
      } else {
        await this.pokemonService.unmarkFavourite(id);
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpErrors.NotFound();
      } else {
        throw new HttpErrors.InternalServerError();
      }
    }
  }
}
