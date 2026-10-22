import { STORAGE_KEYS, storageService } from './StorageService.js';
import { Banco } from '../models/Banco.js';
import { Usuario } from '../models/ Usuario.js';
import { Cuenta } from '../models/Cuenta.js';
import { Movimiento } from '../models/Movimiento.js';

class BancoService {
    constructor() {
        this.banco = new Banco();
    }

    recargarBanco() {
        const usuariosRaw = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
        const cuentasRaw = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
        const movimientosRaw = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

        const usuarios = usuariosRaw.map((u) => new Usuario(u));
        const cuentas = cuentasRaw.map((c) => new Cuenta(c));
        const movimientos = movimientosRaw.map((m) => new Movimiento(m));

        this.banco = new Banco({ usuarios, cuentas, movimientos });
        return this.banco;
    }

    guardarEstado() {
        storageService.guardar(STORAGE_KEYS.USUARIOS, this.banco.usuarios);
        storageService.guardar(STORAGE_KEYS.CUENTAS, this.banco.cuentas);
        storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, this.banco.movimientos);
    }

    obtenerResumenUsuario(usuarioId) {
        this.recargarBanco();
        const cuentas = this.banco.obtenerCuentasDeUsuario(usuarioId);
        const saldoTotal = cuentas.reduce((acc, c) => acc + c.saldo, 0);

        const movimientos = cuentas.flatMap((c) =>
            this.banco.obtenerMovimientosDeCuenta(c.id)
        );

        return {
            cuentas,
            saldoTotal,
            totalCuentas: cuentas.length,
            totalMovimientos: movimientos.length,
        };
    }

    obtenerDatosUsuario(usuarioId) {
        this.recargarBanco();
        const usuario = this.banco.buscarUsuarioPorId(usuarioId);
        const cuentas = this.banco.obtenerCuentasDeUsuario(usuarioId);
        return { usuario, cuentas };
    }

    actualizarUsuario(usuarioId, { nombre, email, telefono }) {
        this.recargarBanco();
        const usuario = this.banco.buscarUsuarioPorId(usuarioId);
        if (!usuario) {
            throw new Error('El usuario no existe.');
        }

        usuario.nombre = nombre.trim();
        usuario.email = email.trim();
        usuario.telefono = telefono.trim();

        // Actualizar datos en sesión activa y base de datos
        storageService.guardar(STORAGE_KEYS.SESION, usuario);
        this.guardarEstado();

        return usuario;
    }

    cambiarPassword(usuarioId, passwordActual, passwordNueva) {
        this.recargarBanco();
        const usuario = this.banco.buscarUsuarioPorId(usuarioId);
        if (!usuario) {
            throw new Error('El usuario no existe.');
        }

        if (usuario.password !== passwordActual) {
            throw new Error('La contraseña actual es incorrecta.');
        }

        if (!passwordNueva || passwordNueva.length < 6) {
            throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
        }

        usuario.password = passwordNueva;

        // Actualizar sesión activa
        storageService.guardar(STORAGE_KEYS.SESION, usuario);
        this.guardarEstado();

        return true;
    }

    eliminarUsuario(usuarioId) {
        this.recargarBanco();
        const cuentas = this.banco.obtenerCuentasDeUsuario(usuarioId);
        const tieneSaldo = cuentas.some((c) => c.saldo > 0);

        if (tieneSaldo) {
            throw new Error('No puedes eliminar la cuenta si aún tienes saldo disponible.');
        }

        this.banco.usuarios = this.banco.usuarios.filter((u) => u.id !== usuarioId);
        this.banco.cuentas = this.banco.cuentas.filter((c) => c.usuarioId !== usuarioId);

        this.guardarEstado();
        return true;
    }

    realizarDeposito({ cuentaId, monto, descripcion }) {
        this.recargarBanco();
        const movimiento = this.banco.realizarDeposito({ cuentaId, monto, descripcion });
        this.guardarEstado();
        return movimiento;
    }

    realizarTransferencia({ cuentaOrigenId, numeroCuentaDestino, monto, descripcion }) {
        this.recargarBanco();
        const resultado = this.banco.realizarTransferencia({
            cuentaOrigenId,
            numeroCuentaDestino,
            monto,
            descripcion,
        });
        this.guardarEstado();
        return resultado;
    }

    obtenerMovimientosUsuario(usuarioId, filtro = 'TODOS') {
        this.recargarBanco();
        const cuentas = this.banco.obtenerCuentasDeUsuario(usuarioId);
        const idsCuentasPropias = cuentas.map((c) => c.id);

        let movimientos = this.banco.movimientos.filter((m) => {
            if (m.tipo === 'DEPOSITO') {
                return idsCuentasPropias.includes(m.cuentaOrigen);
            }
            if (m.tipo === 'TRANSFERENCIA_ENVIADA') {
                return idsCuentasPropias.includes(m.cuentaOrigen);
            }
            if (m.tipo === 'TRANSFERENCIA_RECIBIDA') {
                return idsCuentasPropias.includes(m.cuentaDestino);
            }
            return false;
        });

        if (filtro !== 'TODOS') {
            movimientos = movimientos.filter((m) => m.tipo === filtro);
        }

        return movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    obtenerResumenMovimientos(usuarioId) {
        const todos = this.obtenerMovimientosUsuario(usuarioId, 'TODOS');
        return {
            total: todos.length,
            depositos: todos.filter((m) => m.tipo === 'DEPOSITO').length,
            enviadas: todos.filter((m) => m.tipo === 'TRANSFERENCIA_ENVIADA').length,
            recibidas: todos.filter((m) => m.tipo === 'TRANSFERENCIA_RECIBIDA').length,
        };
    }
}

export const bancoService = new BancoService();