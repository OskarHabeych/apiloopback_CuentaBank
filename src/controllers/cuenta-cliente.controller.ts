import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Cuenta,
  Cliente,
} from '../models';
import {CuentaRepository} from '../repositories';

export class CuentaClienteController {
  constructor(
    @repository(CuentaRepository)
    public cuentaRepository: CuentaRepository,
  ) { }

  @get('/cuentas/{id}/cliente', {
    responses: {
      '200': {
        description: 'Cliente belonging to Cuenta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cliente)},
          },
        },
      },
    },
  })
  async getCliente(
    @param.path.string('id') id: typeof Cuenta.prototype.id,
  ): Promise<Cliente> {
    return this.cuentaRepository.padreFk(id);
  }
}
