/* =========================================
   MOVIMIENTOS UI
========================================= */

import {
    authService,
} from '../services/AuthService.js';

import {
    bancoService,
} from '../services/BancoService.js';

import {
    formatCurrency,
    formatDate,
} from '../utils/formatters.js';


/* =========================================
   ESTADO DE LA INTERFAZ
========================================= */

// Este valor representa el filtro
// actualmente seleccionado.
let filtroActual =
    'TODOS';


/* =========================================
   CIERRE DE SESIÓN
========================================= */

function initLogout() {
    const btn =
        document.querySelector(
            '#logoutBtn',
        );


    if (!btn) {
        return;
    }


    btn.addEventListener(
        'click',
        () => {
            Swal.fire({
                icon: 'question',

                title:
                    'Cerrar sesión',

                text:
                    '¿Seguro que deseas salir?',

                showCancelButton:
                    true,

                confirmButtonText:
                    'Sí, salir',

                cancelButtonText:
                    'Cancelar',
            }).then((result) => {

                if (
                    !result.isConfirmed
                ) {
                    return;
                }


                authService.logout();


                window.location.href =
                    'index.html';
            });
        },
    );
}


/* =========================================
   ETIQUETAS DE MOVIMIENTOS
========================================= */

function obtenerEtiquetaTipo(
    tipo,
) {
    // Transformamos los valores técnicos
    // almacenados en etiquetas amigables.
    const etiquetas = {
        DEPOSITO:
            'Depósito',

        TRANSFERENCIA_ENVIADA:
            'Transferencia enviada',

        TRANSFERENCIA_RECIBIDA:
            'Transferencia recibida',
    };


    return (
        etiquetas[tipo] ||
        tipo
    );
}


/* =========================================
   SIGNO DEL MOVIMIENTO
========================================= */

function obtenerSignoMovimiento(
    tipo,
) {
    // Una transferencia enviada representa
    // una salida de dinero.
    if (
        tipo ===
        'TRANSFERENCIA_ENVIADA'
    ) {
        return '-';
    }


    // Los demás movimientos actuales
    // representan entradas de dinero.
    return '+';
}


/* =========================================
   CLASE VISUAL DEL MOVIMIENTO
========================================= */

function obtenerClaseMovimiento(
    tipo,
) {
    if (
        tipo ===
        'TRANSFERENCIA_ENVIADA'
    ) {
        return 'movimiento-salida';
    }


    return 'movimiento-entrada';
}


/* =========================================
   RENDER PRINCIPAL
========================================= */

function renderMovimientos(
    usuario,
) {
    const root =
        document.querySelector(
            '#movimientosRoot',
        );


    if (!root) {
        return;
    }


    // Obtenemos las cantidades generales
    // de movimientos.
    const resumen =
        bancoService
            .obtenerResumenMovimientos(
                usuario.id,
            );


    // Obtenemos los movimientos aplicando
    // el filtro actualmente seleccionado.
    const movimientos =
        bancoService
            .obtenerMovimientosUsuario(
                usuario.id,
                filtroActual,
            );


    root.innerHTML = `

        <!-- =================================
             ENCABEZADO
        ================================== -->

        <section
            class="movimientos-header"
        >
            <div>

                <span
                    class="dashboard-label"
                >
                    Actividad bancaria
                </span>


                <h2>
                    Historial de movimientos
                </h2>


                <p>
                    Consulta las operaciones
                    realizadas en tus cuentas.
                </p>

            </div>
        </section>


        <!-- =================================
             RESUMEN
        ================================== -->

        <section
            class="movimientos-summary"
        >

            <article
                class="movimiento-summary-card"
            >
                <span>
                    Todos
                </span>

                <strong>
                    ${resumen.total}
                </strong>
            </article>


            <article
                class="movimiento-summary-card"
            >
                <span>
                    Depósitos
                </span>

                <strong>
                    ${resumen.depositos}
                </strong>
            </article>


            <article
                class="movimiento-summary-card"
            >
                <span>
                    Enviadas
                </span>

                <strong>
                    ${resumen.enviadas}
                </strong>
            </article>


            <article
                class="movimiento-summary-card"
            >
                <span>
                    Recibidas
                </span>

                <strong>
                    ${resumen.recibidas}
                </strong>
            </article>

        </section>


        <!-- =================================
             PANEL DE MOVIMIENTOS
        ================================== -->

        <section
            class="movimientos-panel"
        >

            <header
                class="movimientos-toolbar"
            >

                <div>

                    <h3>
                        Operaciones
                    </h3>


                    <p>
                        Filtra el historial
                        por tipo de movimiento.
                    </p>

                </div>


                <!-- =========================
                     FILTROS
                ========================== -->

                <div
                    class="movimientos-filtros"
                >

                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${
                                filtroActual ===
                                'TODOS'
                                    ? 'active'
                                    : ''
                            }
                        "
                        data-filtro="TODOS"
                    >
                        Todos
                    </button>


                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${
                                filtroActual ===
                                'DEPOSITO'
                                    ? 'active'
                                    : ''
                            }
                        "
                        data-filtro="DEPOSITO"
                    >
                        Depósitos
                    </button>


                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${
                                filtroActual ===
                                'TRANSFERENCIA_ENVIADA'
                                    ? 'active'
                                    : ''
                            }
                        "
                        data-filtro="TRANSFERENCIA_ENVIADA"
                    >
                        Enviadas
                    </button>


                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${
                                filtroActual ===
                                'TRANSFERENCIA_RECIBIDA'
                                    ? 'active'
                                    : ''
                            }
                        "
                        data-filtro="TRANSFERENCIA_RECIBIDA"
                    >
                        Recibidas
                    </button>

                </div>

            </header>


            <!-- =================================
                 TABLA O ESTADO VACÍO
            ================================== -->

            ${
                movimientos.length === 0
                    ? `
                        <div
                            class="movimientos-empty"
                        >
                            <strong>
                                No hay movimientos
                                para mostrar.
                            </strong>

                            <p>
                                Realiza un depósito
                                o una transferencia
                                para generar actividad.
                            </p>
                        </div>
                    `
                    : `
                        <div
                            class="table-wrapper"
                        >

                            <table
                                class="movimientos-table"
                            >

                                <thead>

                                    <tr>
                                        <th>
                                            Fecha
                                        </th>

                                        <th>
                                            Tipo
                                        </th>

                                        <th>
                                            Descripción
                                        </th>

                                        <th>
                                            Monto
                                        </th>

                                        <th>
                                            Saldo
                                        </th>
                                    </tr>

                                </thead>


                                <tbody>

                                    ${movimientos
                                        .map(
                                            (
                                                movimiento,
                                            ) => {

                                                const signo =
                                                    obtenerSignoMovimiento(
                                                        movimiento.tipo,
                                                    );


                                                const clase =
                                                    obtenerClaseMovimiento(
                                                        movimiento.tipo,
                                                    );


                                                return `
                                                    <tr>

                                                        <td>
                                                            ${formatDate(
                                                                movimiento.fecha,
                                                            )}
                                                        </td>


                                                        <td>
                                                            <span
                                                                class="
                                                                    movimiento-tipo
                                                                    ${clase}
                                                                "
                                                            >
		                                                    ${obtenerEtiquetaTipo(
                                                                movimiento.tipo,)}
                                                            </span>
                                                        </td>


                                                        <td>
                                                            ${
                                                                movimiento
                                                                    .descripcion ||
                                                                'Sin descripción'
                                                            }
                                                        </td>


                                                        <td
                                                            class="
                                                                movimiento-monto
                                                                ${clase}
                                                            "
                                                        >
                                                            ${signo}${formatCurrency(
                                                                movimiento.monto,
                                                            )}
                                                        </td>


                                                        <td>
                                                            ${formatCurrency(
                                                                movimiento
                                                                    .saldoResultante,
                                                            )}
                                                        </td>

                                                    </tr>
                                                `;
                                            },
                                        )
                                        .join('')}

                                </tbody>

                            </table>

                        </div>
                    `
            }

        </section>
    `;


    initFiltros(
        usuario,
    );
}


/* =========================================
   FILTROS
========================================= */

function initFiltros(
    usuario,
) {
    const botones =
        document.querySelectorAll(
            '[data-filtro]',
        );


    botones.forEach(
        (boton) => {

            boton.addEventListener(
                'click',
                () => {

                    filtroActual =
                        boton.dataset.filtro;


                    renderMovimientos(
                        usuario,
                    );
                },
            );
        },
    );
}


/* =========================================
   INICIALIZACIÓN
========================================= */

function init() {
    const accesoPermitido =
        authService
            .protegerRuta();


    if (!accesoPermitido) {
        return;
    }


    initLogout();


    const usuario =
        authService
            .getCurrentUser();


    if (!usuario) {
        return;
    }


    try {
        bancoService
            .recargarBanco();


        renderMovimientos(
            usuario,
        );
    } catch (error) {
        Swal.fire({
            icon: 'error',

            title:
                'No fue posible cargar los movimientos',

            text:
                error.message,
        });
    }
}


if (
    document.querySelector(
        '.app-movimientos',
    )
) {
    init();
}