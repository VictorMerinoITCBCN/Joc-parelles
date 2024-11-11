class Cookie {
    static get(key) {
        const keyName = key + "="
        const cookies = document.cookie.split(";")

        for (let cookie of cookies) {
            cookie = cookie.trim()
            if (cookie.startsWith(keyName)) {
                return cookie.substring(keyName.length, cookie.length)
            }
        }

        return null
    }

    static create(key, value) {
        document.cookie = `${key} = ${value}`
    }

    static delete(key) {
        document.cookie = `${key} =; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    }
}