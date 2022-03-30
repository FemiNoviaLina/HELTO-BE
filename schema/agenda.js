const postAgendaSchema = { 
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Name invalid',
                    minLength: 'Judul harus diisi',
                    maxLength: 'Maksimal karakter judul adalah 255'
                },
            },
            date: {
                type: 'string',
                errorMessage: {
                    type: 'Date invalid'
                }
            }
        },
        required: ['name', 'date']
    }
}

const updateAgendaSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    },
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Name invalid',
                    minLength: 'Judul harus diisi',
                    maxLength: 'Maksimal karakter judul adalah 255'
                },
            },
            date: {
                type: 'string',
                errorMessage: {
                    type: 'Date invalid'
                }
            }
        }
    }
}

const deleteAgendaSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

const getAgendaByIdSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

export { postAgendaSchema, updateAgendaSchema, deleteAgendaSchema, getAgendaByIdSchema }