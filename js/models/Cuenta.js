import { generarId } from '../utils/helpers.js';

export class Cuenta {
    constructor({
        id = generarId(),
        numeroCuenta,
        tipo = 'Ahorros',
        saldo = 0,
        usuarioId,
        fechaApertura = new Date().toISOString(),
        activa = true,
    } = {}) {
        this.id = id;
        this.numeroCuenta = numeroCuenta;
        this.tipo = tipo;
        this.saldo = Number(saldo);
        this.usuarioId = usuarioId;
        this.fechaApertura = fechaApertura;
        this.activa = activa;
    }

    depositar(monto) {
        const num = Number(monto);
        if (Number.isFinite(num) && num > 0) {
            this.saldo += num;
            return this.saldo;
        }
        throw new Error('Monto inválido para depósito.');
    }

    retirar(monto) {
        const num = Number(monto);
        if (Number.isFinite(num) && num > 0 && num <= this.saldo) {
            this.saldo -= num;
            return this.saldo;
        }
        throw new Error('Fondos insuficientes o monto inválido.');
    }
}