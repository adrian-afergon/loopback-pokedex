import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {PokemonRepository} from '../repositories';
import {Pokemon} from '../models';
import {NotFoundError} from './not-found.error';

interface PokemonQueryParams {
  name?: string;
  type?: string;
  favourite?: boolean;
  hasPagination?: boolean;
  page?: number;
  limit?: number;
}

@injectable({scope: BindingScope.TRANSIENT})
export class PokemonService {
  constructor(
    @repository(PokemonRepository)
    public pokemonRepository: PokemonRepository,
  ) {}

  findAll({
    name,
    type,
    favourite,
    page = 0,
    limit,
    hasPagination,
  }: PokemonQueryParams): Promise<Pokemon[]> {
    return name || type || favourite || hasPagination
      ? this.pokemonRepository.find({
          where: {
            name: name
              ? {like: new RegExp('.*' + name + '.*', 'i')}
              : undefined,
            types: type,
            favourite,
          },
          skip: limit ? (page - 1) * limit : undefined,
          limit: limit,
          order: ['id ASC'],
        })
      : this.pokemonRepository.find();
  }

  async findById(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({where: {id}});
    if (!pokemon) {
      throw new NotFoundError(`Pokemon with id ${id} has not been found`);
    }
    return pokemon;
  }

  async findByName(name: string): Promise<Pokemon> {
    const nameInsensitiveCase = new RegExp(name, 'i');
    const pokemon = await this.pokemonRepository.findOne({
      where: {name: {like: nameInsensitiveCase}},
    });
    if (!pokemon) {
      throw new NotFoundError(`Pokemon with name ${name} has not been found`);
    }
    return pokemon;
  }

  private static removeDuplicatedTypes(
    currentTypes: string[],
    typesToAdd: string[],
  ) {
    return [...new Set([...currentTypes, ...typesToAdd])];
  }

  async findTypes(): Promise<string[]> {
    // probably we can find a better way to do it
    const results = await this.pokemonRepository.find(
      {fields: {types: true}},
      {},
    );
    return results.reduce(
      (list: string[], {types}) =>
        PokemonService.removeDuplicatedTypes(list, types),
      [],
    );
  }

  async markFavourite(id: string) {
    const pokemon = await this.findById(id);
    await this.pokemonRepository.update(
      new Pokemon({
        ...pokemon,
        favourite: true,
      }),
    );
  }

  async unmarkFavourite(id: string) {
    const pokemon = await this.findById(id);
    await this.pokemonRepository.update(
      new Pokemon({
        ...pokemon,
        favourite: false,
      }),
    );
  }
}
