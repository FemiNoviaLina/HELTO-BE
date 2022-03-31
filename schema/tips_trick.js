const postTipsAndTrickSchema = {
    body: {
        properties: {
            title: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Judul invalid',
                    minLength: 'Judul harus diisi',
                    maxLength: 'Maksimal karakter judul adalah 255'
                }
            },
            content: {
                type: 'string',
                minLength: 1,
                errorMessage: {
                    type: 'Konten invalid',
                    minLength: 'Konten harus diisi'
                }
            }
        },
        required: ['title', 'content']
    }
}

const updateTipsAndTrickSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    },
    body: {
        properties: {
            title: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Judul invalid',
                    minLength: 'Judul harus diisi',
                    maxLength: 'Maksimal karakter judul adalah 255'
                }
            },
            content: {
                type: 'string',
                minLength: 1,
                errorMessage: {
                    type: 'Konten invalid',
                    minLength: 'Konten harus diisi'
                }
            }
        }
    }
}

const deleteTipsAndTrickSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

const getTipsAndTrickByIdSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

const getTipsAndTrickSchema = {
    querystring: {
        keyword: {
            type: 'string'
        },
        limit: {
            type: 'number'
        },
        offset: {
            type: 'number'
        }
    }
}

export { postTipsAndTrickSchema, updateTipsAndTrickSchema, deleteTipsAndTrickSchema, getTipsAndTrickByIdSchema, getTipsAndTrickSchema }