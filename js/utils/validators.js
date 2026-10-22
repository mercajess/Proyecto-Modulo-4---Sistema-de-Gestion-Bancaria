/* =========================================
   VALIDADORES
========================================= */
export const validarCampoObligatorio = (valor) => {
    return valor !== null && valor !== undefined && valor.toString().trim() !== '';
};

export const validarMonto = (monto) => {
    const num = Number(monto);
    return Number.isFinite(num) && num > 0;
};