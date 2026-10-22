/* =========================================
   DASHBOARD UI
========================================= */

import { authService } from '../services/AuthService.js';
import { bancoService } from '../services/BancoService.js';
import { formatCurrency, formatDate, formatAccountNumber } from '../utils/formatters.js';

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

function renderDashboard(usuario) {
    const root = document.querySelector('#dashboardRoot');
    if (!root) return;

    const resumen = bancoService.obtenerResumenUsuario(usuario.id);
    const cuentaPrincipal = resumen.cuentas[0] || null;

    root.innerHTML = `
        <section class="dashboard-welcome">
            <div>
                <span class="dashboard-label">Bienvenido de nuevo</span>
                <h2>${usuario.nombre}</h2>
                <p>Gestiona tus saldos, movimientos y transferencias en un solo lugar.</p>
            </div>
        </section>

        <section class="dashboard-cards">
            <article class="dash-card">
                <span>Saldo total disponible</span>
                <strong>${formatCurrency(resumen.saldoTotal)}</strong>
            </article>

            <article class="dash-card">
                <span>Cuentas activas</span>
                <strong>${resumen.totalCuentas}</strong>
            </article>

            <article class="dash-card">
                <span>Movimientos registrados</span>
                <strong>${resumen.totalMovimientos}</strong>
            </article>
        </section>

        ${
            cuentaPrincipal
                ? `
                    <section class="dashboard-account-panel">
                        <h3>Cuenta principal</h3>
                        <div class="account-details">
                            <div>
                                <small>Número de cuenta</small>
                                <p>${formatAccountNumber(cuentaPrincipal.numeroCuenta)}</p>
                            </div>
                            <div>
                                <small>Tipo de cuenta</small>
                                <p>${cuentaPrincipal.tipo || 'Ahorros'}</p>
                            </div>
                            <div>
                                <small>Saldo actual</small>
                                <p class="account-balance">${formatCurrency(cuentaPrincipal.saldo)}</p>
                            </div>
                            <div>
                                <small>Fecha de apertura</small>
                                <p>${formatDate(cuentaPrincipal.fechaApertura)}</p>
                            </div>
                        </div>
                    </section>
                `
                : ''
        }
    `;
}

function init() {
    const accesoPermitido = authService.protegerRuta();
    if (!accesoPermitido) return;

    initLogout();

    const usuario = authService.getCurrentUser();
    if (!usuario) return;

    try {
        bancoService.recargarBanco();
        renderDashboard(usuario);
    } catch (error) {
        console.error('Error al renderizar el Dashboard:', error);
        Swal.fire({
            icon: 'error',
            title: 'No fue posible cargar el Dashboard',
            text: error.message,
        });
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}