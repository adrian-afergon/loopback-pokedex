import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {PokemonRepository} from '../repositories';
import {Pokemon} from '../models';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class PokemonService {
  constructor(
    @repository(PokemonRepository)
    public pokemonRepository: PokemonRepository,
  ) {}

  findAll(filter?: Filter<Pokemon>): Promise<Pokemon[]> {
    return this.pokemonRepository.find(filter);
  }

  findById(id: string): Promise<Pokemon | null> {
    return this.pokemonRepository.findOne({where: {id}});
  }

  findByName(name: string): Promise<Pokemon | null> {
    const nameInsensitiveCase = new RegExp(name, 'i');
    return this.pokemonRepository.findOne({
      where: {name: {like: nameInsensitiveCase}},
    });
  }

  async markFavourite(id: string) {
    const pokemon = await this.findById(id);
    if (!pokemon) {
      throw new HttpErrors.NotFound();
    }
    await this.pokemonRepository.update(
      new Pokemon({
        ...pokemon,
        favourite: true,
      }),
    );
  }

  async unmarkFavourite(id: string) {
    const pokemon = await this.findById(id);
    if (!pokemon) {
      throw new HttpErrors.NotFound();
    }
    await this.pokemonRepository.update(
      new Pokemon({
        ...pokemon,
        favourite: false,
      }),
    );
  }
}
