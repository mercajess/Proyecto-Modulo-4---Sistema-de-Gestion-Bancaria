/* ========================================= 
		CLAVES DE ALMACENAMIENTO
Centralizamos los nombres de todas las claves utilizadas por LocalStorage. 
Así evitamos escribir cadenas manualmente por todo el proyecto. 
========================================= */
export const STORAGE_KEYS = {
    USUARIOS: 'usuarios',
    CUENTAS: 'cuentas',
    MOVIMIENTOS: 'movimientos',
    SESION: 'sesion',
};

/* Esta clase centralizará toda la comunicación con LocalStorage. */
class StorageService {

/* ========================================= 
		GUARDAR INFORMACIÓN
========================================= */
    guardar(clave, valor) {
        const valorJSON = JSON.stringify(valor);
        localStorage.setItem(clave, valorJSON);
    }

/* ========================================= 
		OBTENER INFORMACIÓN 
========================================= */
    obtener(clave, valorPorDefecto = null) {
        const valor = localStorage.getItem(clave);

        if (valor === null) {
            return valorPorDefecto;
        }

        try {
            return JSON.parse(valor);
        } catch (error) {
            console.error(
                `No fue posible leer la clave "${clave}" de LocalStorage.`,
                error,
            );
            return valorPorDefecto;
        }
    }

/* ========================================= 
		ELIMINAR INFORMACIÓN
========================================= */
    eliminar(clave) {
        localStorage.removeItem(clave);
    }

/* ========================================= 
		LIMPIAR LOCALSTORAGE 
========================================= */
    limpiar() {
        localStorage.clear();
    }
}

/* ========================================= 
		CREAR INSTANCIA DEL SERVICIO
========================================= */
export const storageService = new StorageService();