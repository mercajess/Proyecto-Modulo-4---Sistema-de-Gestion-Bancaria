import { generarId } from '../utils/helpers.js';

export class Movimiento {
    constructor({
        id = generarId(),
        tipo,
        monto,
        descripcion = '',
        cuentaOrigen,
        cuentaDestino = null,
        saldoResultante,
        fecha = new Date().toISOString(),
    } = {}) {
        this.id = id;
        this.tipo = tipo;
        this.monto = Number(monto);
        this.descripcion = descripcion;
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
        this.saldoResultante = Number(saldoResultante);
        this.fecha = fecha;
    }
}