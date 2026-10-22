import { generarId } from '../utils/helpers.js';

export class Usuario {
    constructor({
        id = generarId(),
        nombre,
        email,
        telefono,
        password,
        activo = true,
    } = {}) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.password = password;
        this.activo = activo;
    }
}