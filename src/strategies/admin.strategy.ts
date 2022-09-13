import {AuthenticationStrategy} from '@loopback/authentication'; // vamos a definir una estrategia de autenticación por medio de la libreria instalada '@loopback/authentication'
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest'; // "Request" me permite verificar las solicitudes web
import {UserProfile} from '@loopback/security'; // "UserProfile" será el perfil del usuario dentro de la plataforma
import parseBearerToken from 'parse-bearer-token'; // librería parseBearerToken que será el qur va a coger el token de sesión y lo va a validar
import {AuthService} from '../services'; // librería que me llamará el servicio de autenticación

export class AdministradorStrategy implements AuthenticationStrategy {
  name: string = 'admin'; // acá se define el nombre de la estrategia con rol "admin" , osea rol de administrador

  constructor(
    @service(AuthService) // implementamos el servicio o lo inyectamos
    public serviceAuth: AuthService,) {

  }

  async authenticate(request: Request): Promise<UserProfile | undefined> { // método que sirve para autenticarse dentro del servicio web
    const token = parseBearerToken(request); // el método recibe un token para después validarlo
    if (!token) {
      throw new HttpErrors[401]("No existe un token en la solicitud.")
    }

    let info = this.serviceAuth.validarTokenJWT(token); // valida el token
    if (info) {
      let perfil: UserProfile = Object.assign({
        nombre: info.data.nombre
      });
      return perfil;
    } else {
      throw new HttpErrors[401]("El token es válido, pero no tiene los permisos suficientes para ejecutar esta acción.")
    }
  }
}

