import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Cuenta} from '../models';
import {CuentaRepository} from '../repositories';

export class CuentaController {
  constructor(
    @repository(CuentaRepository)
    public cuentaRepository : CuentaRepository,
  ) {}

  @post('/cuentas')
  @response(200, {
    description: 'Cuenta model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cuenta)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cuenta, {
            title: 'NewCuenta',
            exclude: ['id'],
          }),
        },
      },
    })
    cuenta: Omit<Cuenta, 'id'>,
  ): Promise<Cuenta> {
    return this.cuentaRepository.create(cuenta);
  }

  @get('/cuentas/count')
  @response(200, {
    description: 'Cuenta model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cuenta) where?: Where<Cuenta>,
  ): Promise<Count> {
    return this.cuentaRepository.count(where);
  }

  @get('/cuentas')
  @response(200, {
    description: 'Array of Cuenta model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cuenta, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Cuenta) filter?: Filter<Cuenta>,
  ): Promise<Cuenta[]> {
    return this.cuentaRepository.find(filter);
  }

  @patch('/cuentas')
  @response(200, {
    description: 'Cuenta PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cuenta, {partial: true}),
        },
      },
    })
    cuenta: Cuenta,
    @param.where(Cuenta) where?: Where<Cuenta>,
  ): Promise<Count> {
    return this.cuentaRepository.updateAll(cuenta, where);
  }

  @get('/cuentas/{id}')
  @response(200, {
    description: 'Cuenta model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cuenta, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cuenta, {exclude: 'where'}) filter?: FilterExcludingWhere<Cuenta>
  ): Promise<Cuenta> {
    return this.cuentaRepository.findById(id, filter);
  }

  @patch('/cuentas/{id}')
  @response(204, {
    description: 'Cuenta PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cuenta, {partial: true}),
        },
      },
    })
    cuenta: Cuenta,
  ): Promise<void> {
    await this.cuentaRepository.updateById(id, cuenta);
  }

  @put('/cuentas/{id}')
  @response(204, {
    description: 'Cuenta PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cuenta: Cuenta,
  ): Promise<void> {
    await this.cuentaRepository.replaceById(id, cuenta);
  }

  @del('/cuentas/{id}')
  @response(204, {
    description: 'Cuenta DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cuentaRepository.deleteById(id);
  }
}
