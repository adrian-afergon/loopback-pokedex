import {injectable, BindingScope} from '@loopback/core';
import {EntityNotFoundError, Filter, repository} from '@loopback/repository';
import {PokemonRepository} from '../repositories';
import {Pokemon} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class PokemonService {
  constructor(
    @repository(PokemonRepository)
    public pokemonRepository: PokemonRepository,
  ) {}

  findAll(filter?: Filter<Pokemon>): Promise<Pokemon[]> {
    return this.pokemonRepository.find(filter);
  }

  async findById(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({where: {id}});
    if (!pokemon) {
      throw new EntityNotFoundError(Pokemon, id);
    }
    return pokemon;
  }

  async findByName(name: string): Promise<Pokemon> {
    const nameInsensitiveCase = new RegExp(name, 'i');
    const pokemon = await this.pokemonRepository.findOne({
      where: {name: {like: nameInsensitiveCase}},
    });
    if (!pokemon) {
      throw new EntityNotFoundError(Pokemon, name);
    }
    return pokemon;
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
