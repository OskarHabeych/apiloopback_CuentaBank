import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Cliente, Cuenta, CuentaRelations} from '../models';
import {ClienteRepository} from './cliente.repository';
import {UsuarioRepository} from './usuario.repository';

export class CuentaRepository extends DefaultCrudRepository<
  Cuenta,
  typeof Cuenta.prototype.id,
  CuentaRelations
> {

  public readonly padreFk: BelongsToAccessor<Cliente, typeof Cuenta.prototype.id>;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>,
  ) {
    super(Cuenta, dataSource);
    this.padreFk = this.createBelongsToAccessorFor('padreFk', clienteRepositoryGetter,);
    this.registerInclusionResolver('padreFk', this.padreFk.inclusionResolver);
  }
}
