# Sistema de Gestión Bancaria

Proyecto integrador correspondiente al Módulo 4.

El proyecto utiliza JavaScript moderno, programación orientada a objetos, programación funcional, arquitectura modular, manipulación del DOM, LocalStorage y librerías externas.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- LocalStorage
- SweetAlert2
- Git
- GitHub

## Arquitectura actual

```text
js/
├── main.js
│
├── models/
│   ├── Banco.js
│   ├── Cuenta.js
│   ├── Movimiento.js
│   └── Usuario.js
│
├── services/
│   ├── AuthService.js
│   ├── BancoService.js
│   └── StorageService.js
│
├── ui/
│   ├── CuentaUI.js
│   ├── DashboardUI.js
│   ├── MovimientosUI.js
│   └── TransferenciasUI.js
│
└── utils/
    ├── formatters.js
    ├── helpers.js
    └── validators.js
```

## Páginas

La aplicación actualmente contiene:

- `index.html`
- `dashboard.html`
- `cuenta.html`
- `movimientos.html`
- `transferencia.html`

## Autenticación

El sistema permite:

- Registrar usuarios.
- Iniciar sesión.
- Mantener sesión mediante LocalStorage.
- Cerrar sesión.
- Proteger páginas privadas.

## Dashboard

El dashboard muestra:

- Usuario autenticado.
- Saldo total.
- Cantidad de cuentas.
- Cantidad de movimientos.
- Cuenta principal.
- Saldo disponible.

## Mi cuenta

La página de cuenta permite:

- Consultar datos bancarios.
- Modificar información personal.
- Cambiar contraseña.
- Eliminar la cuenta cuando el saldo sea cero.

## Operaciones bancarias

Actualmente se soportan:

### Depósitos

Los depósitos:

1. Validan el monto.
2. Actualizan el saldo.
3. Generan un movimiento `DEPOSITO`.
4. Persisten la operación.

### Transferencias

Las transferencias:

1. Validan cuenta origen.
2. Validan cuenta destino.
3. Validan el monto.
4. Evitan transferencias a la misma cuenta.
5. Validan saldo suficiente.
6. Retiran dinero de la cuenta origen.
7. Depositan dinero en la cuenta destino.
8. Generan `TRANSFERENCIA_ENVIADA`.
9. Generan `TRANSFERENCIA_RECIBIDA`.
10. Persisten saldos y movimientos.

## Movimientos

La página `movimientos.html` permite consultar el historial bancario.

Los tipos soportados son:

- `DEPOSITO`
- `TRANSFERENCIA_ENVIADA`
- `TRANSFERENCIA_RECIBIDA`

## Perspectiva del usuario

Los movimientos se muestran de acuerdo con la cuenta del usuario.

Un depósito pertenece al usuario cuando su cuenta es la cuenta origen.

Una transferencia enviada pertenece al usuario cuando una de sus cuentas es la cuenta origen.

Una transferencia recibida pertenece al usuario cuando una de sus cuentas es la cuenta destino.

Esto evita mostrar las dos representaciones de una transferencia al mismo usuario.

## Filtros

El historial permite filtrar por:

- Todos.
- Depósitos.
- Transferencias enviadas.
- Transferencias recibidas.

## Ordenamiento

Los movimientos se ordenan desde la operación más reciente hasta la más antigua.

## Programación funcional aplicada

Durante el proyecto se utilizan métodos como:

- `map()`
- `filter()`
- `find()`
- `findIndex()`
- `some()`
- `reduce()`
- `forEach()`
- `includes()`
- `sort()`
- `flatMap()`

También se utiliza:

- Destructuring.
- Spread Operator.
- Template literals.
- Operador ternario.

## SweetAlert2

SweetAlert2 se utiliza para:

- Validaciones.
- Mensajes de éxito.
- Errores.
- Confirmación de transferencias.
- Confirmación de cierre de sesión.
- Confirmación de eliminación de usuario.

## Funcionalidades implementadas

Actualmente el proyecto permite:

- Registrar usuarios.
- Crear cuentas.
- Autenticarse.
- Mantener sesión.
- Consultar Dashboard.
- Consultar Mi cuenta.
- Modificar datos.
- Cambiar contraseña.
- Eliminar cuenta.
- Realizar depósitos.
- Realizar transferencias.
- Actualizar saldos.
- Registrar movimientos.
- Mostrar depósitos.
- Mostrar transferencias enviadas.
- Mostrar transferencias recibidas.
- Filtrar movimientos.
- Ordenar movimientos por fecha.
- Mantener persistencia con LocalStorage.

## Próximas versiones

La siguiente versión incorporará principalmente:

- Jest.
- jsdom.
- Pruebas de modelos.
- Pruebas de utilidades.
- Pruebas de AuthService.
- Pruebas de BancoService.
- Pruebas de operaciones bancarias.
- Pruebas de casos negativos.

Después se realizará la revisión final para `v1.0.0`.

## Versión actual

v0.10.0 — Historial de movimientos y filtros.