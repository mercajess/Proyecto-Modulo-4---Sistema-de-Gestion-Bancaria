/* ========================================= 
		IMPORTACIONES
========================================= */
import {
    validarCampoObligatorio,
    validarMonto,
} from './utils/validators.js';

import {
    generarId,
} from './utils/helpers.js';

import {
    formatCurrency,
    formatDate,
    formatAccountNumber,
} from './utils/formatters.js';

import {
    Usuario,
} from './models/ Usuario.js';

import {
    Cuenta,
} from './models/Cuenta.js';

import {
    Movimiento,
} from './models/Movimiento.js';

import {
    Banco,
} from './models/Banco.js';

import {
    STORAGE_KEYS,
    storageService,
} from './services/StorageService.js';


console.log(
    'Sistema de Gestión Bancaria - v0.5.0',
);


// ==========================================
// FUNCIONES DE PERSISTENCIA EN LOCAL STORAGE
// ==========================================

function guardarBanco(banco) {
    storageService.guardar(
        STORAGE_KEYS.USUARIOS,
        banco.usuarios,
    );

    storageService.guardar(
        STORAGE_KEYS.CUENTAS,
        banco.cuentas,
    );

    storageService.guardar(
        STORAGE_KEYS.MOVIMIENTOS,
        banco.movimientos,
    );
}

// ==========================================
// FUNCION PARA CARGAR LOS DATOS DEL BANCO
// ==========================================

function cargarBanco() {
    const usuariosGuardados =
        storageService.obtener(
            STORAGE_KEYS.USUARIOS,
            [],
        );

    const cuentasGuardadas =
        storageService.obtener(
            STORAGE_KEYS.CUENTAS,
            [],
        );

    const movimientosGuardados =
        storageService.obtener(
            STORAGE_KEYS.MOVIMIENTOS,
            [],
        );

// ==========================================
// RECONSTRUIMOS LAS INSTANCIAS
// PARA RECUPERAR USUARIO, Y SUS METODOS
// ==========================================
    const usuarios =
        usuariosGuardados.map(
            (usuario) =>
                new Usuario(usuario),
        );

    const cuentas =
        cuentasGuardadas.map(
            (cuenta) =>
                new Cuenta(cuenta),
        );

    const movimientos =
        movimientosGuardados.map(
            (movimiento) =>
                new Movimiento(
                    movimiento,
                ),
        );

// ==========================================
// RECONSTRUIMOS NUEVAMENTE EL BANCO
// ==========================================
    return new Banco({
        usuarios,
        cuentas,
        movimientos,
    });
}


// ==========================================
// PRUEBAS DE UTILIDADES
// ==========================================

console.log(
    'Campo obligatorio:',
    validarCampoObligatorio(
        'Banco Digital',
    ),
);

console.log(
    'Monto válido:',
    validarMonto(1000),
);

console.log(
    'ID generado:',
    generarId(),
);

console.log(
    'Monto formateado:',
    formatCurrency(1500),
);

console.log(
    'Fecha formateada:',
    formatDate(new Date()),
);

console.log(
    'Número de cuenta:',
    formatAccountNumber(
        '123456789012',
    ),
);


// ==========================================
// CARGAR BANCO PERSISTIDO
// ==========================================

const bancoDemo = cargarBanco();


// ==========================================
// DATOS INICIALES
// VALIDAR SI EL BANCO ESTÁ VACÍO
// ==========================================

if (bancoDemo.usuarios.length === 0) {
	
	// CREAR USUARIO INICIAL DEMO
    const usuarioDemo =
        new Usuario({
            nombre: 'Juan Suarez',
            email: 'juan@correo.com',
            telefono: '5512345678',
            password: '123456',
        });

	// REGISTRAR USUARIO
    bancoDemo.agregarUsuario(usuarioDemo);

	// CREAR CUENTA INICIAL DEMO
    const cuentaDemo =
        new Cuenta({
            numeroCuenta: '123456789012',
            usuarioId: usuarioDemo.id,
        });

	// REGISTRAR CUENTA
    bancoDemo.agregarCuenta(cuentaDemo);

	// REALIZAR DEPÓSITO INICIAL DEMO
    bancoDemo.realizarDeposito({
        cuentaId: cuentaDemo.id,
        monto: 1000,
        descripcion: 'Depósito inicial',
    });

	// GUARDAR BANCO DEMO
    guardarBanco(bancoDemo);

    console.log(
        'Datos iniciales creados y guardados.',
    );
}


// ==========================================
// COMPROBAR DATOS RECUPERADOS
// ==========================================

console.log(
    'Banco recuperado:',
    bancoDemo,
);
//mostrar usuarios
console.log(
    'Usuarios almacenados:',
    bancoDemo.usuarios,
);
//mostrar cuentas
console.log(
    'Cuentas almacenadas:',
    bancoDemo.cuentas,
);
//mostrar movimientos
console.log(
    'Movimientos almacenados:',
    bancoDemo.movimientos,
);


// ==========================================
// OBTENER PRIMERA CUENTA 
// ==========================================
const cuentaPrincipal =
    bancoDemo.cuentas[0] || null;

/* ========================================= 
	SI EXISTE MOSTRAR SALDO PERSISTIDO 
========================================= */
if (cuentaPrincipal) {
    console.log(
        'Saldo persistido:',
        formatCurrency(
            cuentaPrincipal.saldo,
        ),
    );

    console.log(
        '¿La cuenta recuperada sigue siendo una instancia de Cuenta?',
        cuentaPrincipal instanceof Cuenta,
    );

    console.log(
        'Tipo de depositar:',
        typeof cuentaPrincipal.depositar,
    );
}