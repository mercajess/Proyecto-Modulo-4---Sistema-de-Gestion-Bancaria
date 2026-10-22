/* =========================================
   CUENTA UI
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

function renderCuenta(usuario) {
    const root = document.querySelector('#cuentaRoot');
    if (!root) return;

    const datos = bancoService.obtenerDatosUsuario(usuario.id);
    const cuenta = datos.cuentas[0] || null;

    root.innerHTML = `
        <section class="cuenta-header">
            <div>
                <span class="dashboard-label">Gestión de Perfil</span>
                <h2>Mi cuenta</h2>
                <p>Consulta y actualiza tu información personal y de seguridad.</p>
            </div>
        </section>

        ${
            cuenta
                ? `
                    <section class="cuenta-section">
                        <h3>Información Bancaria</h3>
                        <div class="account-details">
                            <div>
                                <small>Titular</small>
                                <p>${usuario.nombre}</p>
                            </div>
                            <div>
                                <small>Número de cuenta</small>
                                <p>${formatAccountNumber(cuenta.numeroCuenta)}</p>
                            </div>
                            <div>
                                <small>Saldo actual</small>
                                <p class="account-balance">${formatCurrency(cuenta.saldo)}</p>
                            </div>
                        </div>
                    </section>
                `
                : ''
        }

        <section class="cuenta-section">
            <h3>Datos personales</h3>
            <form id="perfilForm" class="cuenta-form">
                <div class="form-group">
                    <label for="nombre">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" value="${usuario.nombre}" required>
                </div>

                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input type="email" id="email" name="email" value="${usuario.email}" required>
                </div>

                <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value="${usuario.telefono || ''}" required>
                </div>

                <button type="submit" class="btn btn-primary">Guardar cambios</button>
            </form>
        </section>

        <section class="cuenta-section">
            <h3>Seguridad</h3>
            <form id="passwordForm" class="cuenta-form">
                <div class="form-group">
                    <label for="passwordActual">Contraseña actual</label>
                    <input type="password" id="passwordActual" name="passwordActual" required>
                </div>

                <div class="form-group">
                    <label for="passwordNueva">Nueva contraseña</label>
                    <input type="password" id="passwordNueva" name="passwordNueva" required>
                </div>

                <button type="submit" class="btn btn-secondary">Cambiar contraseña</button>
            </form>
        </section>

        <section class="cuenta-section peligro">
            <h3>Eliminar cuenta</h3>
            <p>Esta acción es permanente y eliminará todo tu historial. Solo se permite con saldo $0.00.</p>
            <button type="button" id="eliminarCuentaBtn" class="btn btn-danger">Eliminar mi cuenta</button>
        </section>
    `;

    initForms(usuario);
}

function initForms(usuario) {
    const perfilForm = document.querySelector('#perfilForm');
    if (perfilForm) {
        perfilForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.querySelector('#nombre').value;
            const email = document.querySelector('#email').value;
            const telefono = document.querySelector('#telefono').value;

            try {
                const usuarioActualizado = bancoService.actualizarUsuario(usuario.id, { nombre, email, telefono });
                Swal.fire({
                    icon: 'success',
                    title: 'Perfil actualizado',
                    text: 'Tus datos fueron guardados correctamente.',
                });
                renderCuenta(usuarioActualizado);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            }
        });
    }

    const passwordForm = document.querySelector('#passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const passwordActual = document.querySelector('#passwordActual').value;
            const passwordNueva = document.querySelector('#passwordNueva').value;

            try {
                bancoService.cambiarPassword(usuario.id, passwordActual, passwordNueva);
                Swal.fire({
                    icon: 'success',
                    title: 'Contraseña actualizada',
                    text: 'Tu contraseña ha sido cambiada exitosamente.',
                });
                passwordForm.reset();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            }
        });
    }

    const eliminarBtn = document.querySelector('#eliminarCuentaBtn');
    if (eliminarBtn) {
        eliminarBtn.addEventListener('click', () => {
            Swal.fire({
                icon: 'warning',
                title: '¿Eliminar cuenta?',
                text: 'Esta acción no se puede deshacer.',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#d33',
            }).then((result) => {
                if (!result.isConfirmed) return;

                try {
                    bancoService.eliminarUsuario(usuario.id);
                    authService.logout();
                    Swal.fire({
                        icon: 'info',
                        title: 'Cuenta eliminada',
                        text: 'Tu usuario y cuenta han sido eliminados.',
                    }).then(() => {
                        window.location.href = 'index.html';
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo eliminar',
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
        renderCuenta(usuario);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar cuenta',
            text: error.message,
        });
    }
}

if (document.querySelector('.app-cuenta')) {
    init();
}