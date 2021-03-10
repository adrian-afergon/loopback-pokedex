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
import {NotFoundError} from '../services/not-found.error';

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
    @param.query.string('type') type?: string,
    @param.query.boolean('favourite') favourite?: boolean,
    @param.query.number('page') page?: number,
    @param.query.number('limit') limit?: number,
  ): Promise<Pokemon[]> {
    return this.pokemonService.findAll({
      name,
      type,
      favourite,
      page,
      limit,
      hasPagination: Boolean(page && limit),
    });
  }

  @get('/pokemon/types')
  @response(200, {
    description: 'List of pokemon types',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pokemon, {includeRelations: true}),
      },
    },
  })
  async findTypes(): Promise<string[]> {
    return this.pokemonService.findTypes();
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
  async findById(@param.path.string('id') id: string): Promise<Pokemon> {
    try {
      return await this.pokemonService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundError) {
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
  async findByName(@param.path.string('name') name: string): Promise<Pokemon> {
    try {
      return await this.pokemonService.findByName(name);
    } catch (error) {
      if (error instanceof NotFoundError) {
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
      if (error instanceof NotFoundError) {
        throw new HttpErrors.NotFound();
      } else {
        throw new HttpErrors.InternalServerError();
      }
    }
  }
}
