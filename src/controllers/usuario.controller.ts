import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import axios from 'axios';
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {AuthService} from '../services';

@authenticate("admin") // el controlador requiere que se este autenticado como administrador
export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(AuthService)
    public servicioAuth: AuthService
  ) { }
  @authenticate.skip()
  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    //return this.usuarioRepository.create(usuario);
    //Nuevo
    let clave = this.servicioAuth.GenerarClave();
    let claveCifrada = this.servicioAuth.CifrarClave(clave);
    usuario.password = claveCifrada;
    let p = await this.usuarioRepository.create(usuario);
    // Notificamos al usuario por correo
    let destino = usuario.correo;
    // Notifiamos al usuario por telefono y cambiar la url por send_sms
    // let destino = usuario.telefono;

    let asunto = 'Registro de usuario en plataforma';
    let contenido = `Hola, ${usuario.nombres} ${usuario.apellidos} su contraseña en el portal es: ${clave}`
    axios({
      method: 'post',
      url: 'http://localhost:5000/send_email', //Si quiero enviar por mensaje cambiar a send_sms

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        destino: destino,
        asunto: asunto,
        contenido: contenido
      }
    }).then((data: any) => {
      console.log(data)
    }).catch((err: any) => {
      console.log(err)
    })

    return p;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

  //Servicio de login
  @authenticate.skip()
  @post('/login', { // "/login" es el nombre ser servicio web y se define por el método http "post"
    responses: {
      '200': { // tiene una respuesta que es el status "200" en la solicitud web que quiere decir que esta se hizo correctamente
        description: 'Identificación de usuarios'
      }
    }
  })

  async login( // función login que posse un requestBody()
    @requestBody() credenciales: Credenciales // el requestBody() es la info que entra desde la solicitud en la interface y espera un objeto de tipo "credenciales" que tiene un usuario y un password
  ) {
    let p = await this.servicioAuth.IdentificarPersona(credenciales.usuario, credenciales.password); // pasa un usuario y la contraseña en el método "IndentificaPersona" para identificar si la persona esta registrada en la BD
    if (p) {
      let token = this.servicioAuth.GenerarTokenJWT(p); // si la persona esta registrada en la BD se me gerena un token que va con un cuerpo

      return {
        status: "success",
        data: {
          nombre: p.nombres,
          apellidos: p.apellidos,
          correo: p.correo,
          id: p.id
        },
        token: token // instrucción que me devuelve el token como tal si efectivamente la persona se encontró registrada en la BD
      }
    } else {
      throw new HttpErrors[401]("Datos invalidos")  // en dado caso si la persona no existe en la BD se me muestra un error http (401) que quiere decir que la persona no esta autorizada
    }
  }

}
