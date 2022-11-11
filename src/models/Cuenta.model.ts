import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Cliente} from './cliente.model';

@model()
export class Cuenta extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  num_Cuenta: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo_Cuenta: string;

  @property({
    type: 'string',
    required: true,
  })
  estado_Cuenta: string;

  @property({
    type: 'number',
    required: true,
  })
  debitos: number;

  @property({
    type: 'number',
    required: true,
  })
  creditos: number;

  @property({
    type: 'number',
    required: true,
  })
  savings: number;

  @belongsTo(() => Cliente, {name: 'padreFk'})
  padre: string;

  constructor(data?: Partial<Cuenta>) {
    super(data);
  }
}

export interface CuentaRelations {
  // describe navigational properties here
}

export type CuentaWithRelations = Cuenta & CuentaRelations;
