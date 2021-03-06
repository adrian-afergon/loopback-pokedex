import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Pokemon extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  classification: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  types: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  resistant?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  weaknesses?: string[];

  @property({
    type: 'object',
  })
  weight?: object;

  @property({
    type: 'object',
  })
  height?: object;

  @property({
    type: 'number',
    required: true,
  })
  fleeRate?: number;

  @property({
    type: 'number',
    required: true,
  })
  maxCP: number;

  @property({
    type: 'number',
    required: true,
  })
  maxHP: number;

  @property({
    type: 'object',
    required: true,
  })
  attacks: object;

  @property({
    type: 'object',
  })
  evolutions?: object;

  @property({
    type: 'object',
  })
  evolutionRequirements?: object;

  @property({
    type: 'object',
  })
  previousEvolutions?: object;

  [prop: string]: string|number|object|boolean|undefined;

  constructor(data?: Partial<Pokemon>) {
    super(data);
  }
}

export interface PokemonRelations {
  // describe navigational properties here
}

export type PokemonWithRelations = Pokemon & PokemonRelations;