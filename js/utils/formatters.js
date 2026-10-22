/* =========================================
   FORMATEADORES
========================================= */
export const formatCurrency = (monto) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(monto);
};

export const formatDate = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatAccountNumber = (numero) => {
    if (!numero) return '';
    return numero.replace(/(\d{4})/g, '$1 ').trim();
};