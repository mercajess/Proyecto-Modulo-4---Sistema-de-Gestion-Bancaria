import { STORAGE_KEYS, storageService } from './StorageService.js';
import { Usuario } from '../models/ Usuario.js';
import { Cuenta } from '../models/Cuenta.js';
import { Banco } from '../models/Banco.js';

class AuthService {
    getCurrentUser() {
        return storageService.obtener(STORAGE_KEYS.SESION, null);
    }

    login(email, password) {
        const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
        const usuario = usuarios.find(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );

        if (!usuario) {
            throw new Error('Credenciales incorrectas.');
        }

        storageService.guardar(STORAGE_KEYS.SESION, usuario);
        return usuario;
    }

    register({ nombre, email, telefono, password }) {
        const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
        const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
        const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

        const existe = usuarios.some(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (existe) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            telefono,
            password,
        });

        const nuevaCuenta = new Cuenta({
            numeroCuenta: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
            usuarioId: nuevoUsuario.id,
            saldo: 0,
        });

        usuarios.push(nuevoUsuario);
        cuentas.push(nuevaCuenta);

        storageService.guardar(STORAGE_KEYS.USUARIOS, usuarios);
        storageService.guardar(STORAGE_KEYS.CUENTAS, cuentas);

        // Iniciar sesión automáticamente
        storageService.guardar(STORAGE_KEYS.SESION, nuevoUsuario);

        return { usuario: nuevoUsuario, cuenta: nuevaCuenta };
    }

    logout() {
        storageService.eliminar(STORAGE_KEYS.SESION);
    }

    protegerRuta() {
        const usuario = this.getCurrentUser();
        if (!usuario) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
}

export const authService = new AuthService();