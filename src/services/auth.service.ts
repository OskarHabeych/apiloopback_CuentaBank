import { /* inject, */ BindingScope, injectable} from '@loopback/core';
// Nuevas librerias
const generator = require("password-generator");
const cryptoJS = require("crypto-js");


@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  //Generacion de claves
  GenerarClave() {
    let clave = generator(8, false);
    return clave;
  }
  //Cifrar clave, se codificará en formato MD5
  CifrarClave(clave: String) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

}
