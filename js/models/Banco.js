/* =========================================
   MODELO BANCO
========================================= */
import { Movimiento } from './Movimiento.js';

export class Banco {
    constructor({
        usuarios = [],
        cuentas = [],
        movimientos = [],
    } = {}) {
        this.usuarios = usuarios;
        this.cuentas = cuentas;
        this.movimientos = movimientos;
    }

    agregarUsuario(usuario) {
        const existe = this.usuarios.some((u) => u.id === usuario.id);
        if (existe) {
            throw new Error('El usuario ya existe.');
        }
        this.usuarios.push(usuario);
        return usuario;
    }

    buscarUsuarioPorId(usuarioId) {
        return this.usuarios.find((usuario) => usuario.id === usuarioId) || null;
    }

    agregarCuenta(cuenta) {
        const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);
        if (!usuario) {
            throw new Error('El usuario propietario de la cuenta no existe.');
        }

        const existe = this.cuentas.some(
            (c) => c.id === cuenta.id || c.numeroCuenta === cuenta.numeroCuenta,
        );
        if (existe) {
            throw new Error('La cuenta ya existe.');
        }

        this.cuentas.push(cuenta);
        return cuenta;
    }

    buscarCuentaPorId(cuentaId) {
        return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
    }

    buscarCuentaPorNumero(numeroCuenta) {
    if (!numeroCuenta) return null;
    const numeroLimpio = numeroCuenta.toString().replace(/\s+/g, '').trim();
    return this.cuentas.find(
        (cuenta) => cuenta.numeroCuenta.toString().replace(/\s+/g, '').trim() === numeroLimpio,
    ) || null;
}

    obtenerCuentasDeUsuario(usuarioId) {
        return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
    }

    registrarMovimiento(movimiento) {
        this.movimientos.push(movimiento);
        return movimiento;
    }

    realizarDeposito({ cuentaId, monto, descripcion = '' }) {
        const montoNumerico = Number(monto);
        if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
            throw new Error('Monto inválido, el monto debe ser mayor a cero.');
        }

        const cuenta = this.buscarCuentaPorId(cuentaId);
        if (!cuenta) {
            throw new Error('La cuenta no existe.');
        }

        cuenta.depositar(montoNumerico);

        const movimiento = new Movimiento({
            tipo: 'DEPOSITO',
            monto: montoNumerico,
            descripcion,
            cuentaOrigen: cuenta.id,
            saldoResultante: cuenta.saldo,
        });

        this.registrarMovimiento(movimiento);
        return movimiento;
    }

    realizarTransferencia({ cuentaOrigenId, numeroCuentaDestino, monto, descripcion = '' }) {
        const montoNumerico = Number(monto);
        if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
            throw new Error('El monto debe ser un número mayor a cero.');
        }

        const cuentaOrigen = this.buscarCuentaPorId(cuentaOrigenId);
        if (!cuentaOrigen) {
            throw new Error('La cuenta de origen no existe.');
        }

        const cuentaDestino = this.buscarCuentaPorNumero(numeroCuentaDestino);
        if (!cuentaDestino) {
            throw new Error('La cuenta de destino no existe.');
        }

        if (cuentaOrigen.id === cuentaDestino.id) {
            throw new Error('No puedes realizar una transferencia a la misma cuenta.');
        }

        if (cuentaOrigen.saldo < montoNumerico) {
            throw new Error('Saldo insuficiente para realizar la transferencia.');
        }

        cuentaOrigen.retirar(montoNumerico);
        cuentaDestino.depositar(montoNumerico);

        // Movimiento para la cuenta origen (salida)
        const movimientoSalida = new Movimiento({
            tipo: 'TRANSFERENCIA_ENVIADA',
            monto: montoNumerico,
            descripcion: descripcion || `Transferencia a ${cuentaDestino.numeroCuenta}`,
            cuentaOrigen: cuentaOrigen.id,
            cuentaDestino: cuentaDestino.id,
            saldoResultante: cuentaOrigen.saldo,
        });

        // Movimiento para la cuenta destino (entrada)
        const movimientoEntrada = new Movimiento({
            tipo: 'TRANSFERENCIA_RECIBIDA',
            monto: montoNumerico,
            descripcion: descripcion || `Transferencia de ${cuentaOrigen.numeroCuenta}`,
            cuentaOrigen: cuentaOrigen.id,
            cuentaDestino: cuentaDestino.id,
            saldoResultante: cuentaDestino.saldo,
        });

        this.registrarMovimiento(movimientoSalida);
        this.registrarMovimiento(movimientoEntrada);

        return { movimientoSalida, movimientoEntrada };
    }

    obtenerMovimientosDeCuenta(cuentaId) {
        return this.movimientos.filter(
            (movimiento) =>
                movimiento.cuentaOrigen === cuentaId ||
                movimiento.cuentaDestino === cuentaId,
        );
    }
}