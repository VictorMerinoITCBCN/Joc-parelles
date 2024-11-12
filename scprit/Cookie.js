class Cookie {
    // Método estático para obtener el valor de una cookie específica
    static get(key) {
        const keyName = key + "="               // Forma la clave buscada, agregando el signo "="
        const cookies = document.cookie.split(";")  // Divide todas las cookies en un array, usando ";" como separador

        // Recorre cada cookie en el array
        for (let cookie of cookies) {
            cookie = cookie.trim()               // Elimina espacios en blanco al inicio y final de cada cookie
            // Verifica si la cookie comienza con la clave buscada
            if (cookie.startsWith(keyName)) {
                // Si la clave coincide, retorna el valor después de "clave="
                return cookie.substring(keyName.length, cookie.length)
            }
        }

        // Si no encuentra la cookie con la clave buscada, retorna null
        return null
    }

    // Método estático para crear una cookie con una clave y un valor especificados
    static create(key, value) {
        // Establece la cookie en el formato "clave=valor"
        document.cookie = `${key} = ${value}`
    }

    // Método estático para eliminar una cookie, configurando una fecha de expiración en el pasado
    static delete(key) {
        // Establece la cookie con una fecha de expiración pasada para eliminarla
        document.cookie = `${key} =; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    }
}
