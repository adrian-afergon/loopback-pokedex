import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Pokemon, PokemonRelations} from '../models';

export type PokemonFindAllParams = {
  name?: string;
  type?: string;
  favourite?: boolean;
  skip?: number;
  limit?: number;
};

export class PokemonRepository extends DefaultCrudRepository<
  Pokemon,
  typeof Pokemon.prototype.id,
  PokemonRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Pokemon, dataSource);
  }

  findByParams({
    name,
    type,
    favourite,
    skip,
    limit,
  }: PokemonFindAllParams): Promise<Pokemon[]> {
    return this.find({
      where: {
        name: name ? {like: new RegExp('.*' + name + '.*', 'i')} : undefined,
        types: type,
        favourite,
      },
      skip: skip,
      limit: limit,
      order: ['id ASC'],
    });
  }
}
