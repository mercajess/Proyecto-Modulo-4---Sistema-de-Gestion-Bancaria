/* =========================================
   TRANSFERENCIAS UI
========================================= */

import { authService } from '../services/AuthService.js';
import { bancoService } from '../services/BancoService.js';
import { formatCurrency, formatAccountNumber } from '../utils/formatters.js';

function initLogout() {
    const btn = document.querySelector('#logoutBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        Swal.fire({
            icon: 'question',
            title: 'Cerrar sesión',
            text: '¿Seguro que deseas salir?',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (!result.isConfirmed) return;
            authService.logout();
            window.location.href = 'index.html';
        });
    });
}

function renderTransferencias(usuario) {
    const root = document.querySelector('#transferenciaRoot');
    if (!root) return;

    const datos = bancoService.obtenerDatosUsuario(usuario.id);
    const cuenta = datos.cuentas[0] || null;

    root.innerHTML = `
        <section class="transferencia-header">
            <div>
                <span class="dashboard-label">Operaciones financieras</span>
                <h2>Depósitos y Transferencias</h2>
                <p>Ingresa saldo a tus cuentas o realiza envíos de dinero en tiempo real.</p>
            </div>
        </section>

        ${
            cuenta
                ? `
                    <div class="transferencia-grid">
                        <!-- DEPÓSITOS -->
                        <article class="operacion-card">
                            <div>
                                <h3>Realizar Depósito</h3>
                                <p>Añade fondos directamente a tu cuenta principal (${formatAccountNumber(cuenta.numeroCuenta)}).</p>
                            </div>

                            <form id="depositoForm" class="operacion-form">
                                <div class="form-group">
                                    <label for="depositoMonto">Monto a depositar ($)</label>
                                    <input type="number" id="depositoMonto" min="1" step="any" placeholder="Ej: 1000" required>
                                </div>

                                <div class="form-group">
                                    <label for="depositoDesc">Concepto / Descripción</label>
                                    <input type="text" id="depositoDesc" placeholder="Ej: Depósito por nómina">
                                </div>

                                <button type="submit" class="btn btn-primary">Abonar a cuenta</button>
                            </form>
                        </article>

                        <!-- TRANSFERENCIAS -->
                        <article class="operacion-card">
                            <div>
                                <h3>Transferencia Bancaria</h3>
                                <p>Saldo disponible: <strong>${formatCurrency(cuenta.saldo)}</strong></p>
                            </div>

                            <form id="transferenciaForm" class="operacion-form">
                                <div class="form-group">
                                    <label for="destinoNumero">Número de cuenta destino</label>
                                    <input type="text" id="destinoNumero" placeholder="Ej: 1234 5678 9012" required>
                                </div>

                                <div class="form-group">
                                    <label for="transferenciaMonto">Monto a enviar ($)</label>
                                    <input type="number" id="transferenciaMonto" min="1" step="any" placeholder="Ej: 500" required>
                                </div>

                                <div class="form-group">
                                    <label for="transferenciaDesc">Concepto</label>
                                    <input type="text" id="transferenciaDesc" placeholder="Ej: Pago de renta">
                                </div>

                                <button type="submit" class="btn btn-primary">Enviar transferencia</button>
                            </form>
                        </article>
                    </div>
                `
                : '<p>No se encontró una cuenta activa para realizar operaciones.</p>'
        }
    `;

    if (cuenta) {
        initForms(usuario, cuenta);
    }
}

function initForms(usuario, cuenta) {
    const depositoForm = document.querySelector('#depositoForm');
    if (depositoForm) {
        depositoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const monto = document.querySelector('#depositoMonto').value;
            const descripcion = document.querySelector('#depositoDesc').value;

            try {
                bancoService.realizarDeposito({
                    cuentaId: cuenta.id,
                    monto: Number(monto),
                    descripcion,
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Depósito realizado',
                    text: `Se han abonado ${formatCurrency(monto)} a tu cuenta correctamente.`,
                });

                renderTransferencias(usuario);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el depósito',
                    text: error.message,
                });
            }
        });
    }

    const transferenciaForm = document.querySelector('#transferenciaForm');
    if (transferenciaForm) {
        transferenciaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawCuentaDestino = document.querySelector('#destinoNumero').value;
            const numeroCuentaDestino = rawCuentaDestino.replace(/\s+/g, '').trim();
            const monto = document.querySelector('#transferenciaMonto').value;
            const descripcion = document.querySelector('#transferenciaDesc').value;

            Swal.fire({
                icon: 'question',
                title: 'Confirmar Transferencia',
                text: `¿Deseas enviar ${formatCurrency(monto)} a la cuenta ${rawCuentaDestino}?`,
                showCancelButton: true,
                confirmButtonText: 'Sí, transferir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (!result.isConfirmed) return;

                try {
                    bancoService.realizarTransferencia({
                        cuentaOrigenId: cuenta.id,
                        numeroCuentaDestino,
                        monto: Number(monto),
                        descripcion,
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Transferencia exitosa',
                        text: 'El envío de fondos se ha completado correctamente.',
                    });

                    renderTransferencias(usuario);
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo completar la transferencia',
                        text: error.message,
                    });
                }
            });
        });
    }
}

function init() {
    const accesoPermitido = authService.protegerRuta();
    if (!accesoPermitido) return;

    initLogout();

    const usuario = authService.getCurrentUser();
    if (!usuario) return;

    try {
        bancoService.recargarBanco();
        renderTransferencias(usuario);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar operaciones',
            text: error.message,
        });
    }
}

if (document.querySelector('.app-transferencia')) {
    init();
}