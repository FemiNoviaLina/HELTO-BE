const loginSchema = {
    body: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                minLength: 1,
                maxLength: 320,
                errorMessage: {
                    format: 'Email invalid'
                }
            },
            password: {
                type: 'string',
                pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
                errorMessage: {
                    type: "Password harus berupa string",
                    pattern: "Password minimal berisi 8 karakter, terdiri dari huruf dan angka"
                }
            }
        },
        required: ['email', 'password'],
        additionalProperties: false
    }
}

const registerSchema = {
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Name invalid',
                    maxLength: 'Maksimal karakter nama adalah 255'
                }
            }, 
            email: {
                type: 'string',
                format: 'email',
                minLength: 1,
                maxLength: 320,
                errorMessage: {
                    format: 'Email invalid'
                }
            },
            phone: {
                type: 'string',
                pattern: '^(\\+62|62|0)8[1-9][0-9]{6,9}$',
                errorMessage: {
                    type: 'Phone invalid',
                    pattern: 'Nomor telepon invalid'
                }
            },
            region: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Region invalid',
                    maxLength: 'Maksimal karakter region adalah 255'
                }
            },
            password: {
                type: 'string',
                pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
                errorMessage: {
                    type: "Password harus berupa string",
                    pattern: "Password minimal berisi 8 karakter, terdiri dari huruf dan angka"
                }
            },
            isAdmin: {
                type: 'boolean',
                errorMessage: {
                    type: 'IsAdmin invalid'
                }
            }
        },
        required: ['name', 'email', 'phone', 'password'],
        additionalProperties: false
    }
}

export { loginSchema, registerSchema }
