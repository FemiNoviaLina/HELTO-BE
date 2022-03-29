const getNewsSchema = {
    querystring: {
        limit: {
            type: 'number',
            minimum: 1,
            maximum: 100,
            errorMessage: {
                type: 'Limit invalid',
                minimum: 'Limit minimal 1',
                maximum: 'Limit maksimal 100'
            }
        }, 
        offset: {
            type: 'number',
            minimum: 0,
            errorMessage: {
                type: 'Offset invalid',
                minimum: 'Offset minimal 0'
            }
        }
    }
}

const getNewsByIdSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

const postNewsSchema = {
    body: {
        properties: {
            title: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Title invalid',
                    minLength: 'Judul harus diisi',
                    maxLength: 'Maksimal karakter judul adalah 255'
                }
            },
            content: {
                type: 'string',
                minLength: 1,
                errorMessage: {
                    type: 'Content invalid',
                    minLength: 'Konten harus diisi'
                }
            }
        },
        required: ['title', 'content']
    }
}

const updateNewsSchema = {
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
                    type: 'Title invalid',
                    minLength: 'Judul harus diisi',
                    maxLength: 'Maksimal karakter judul adalah 255'
                }
            },
            content: {
                type: 'string',
                minLength: 1,
                errorMessage: {
                    type: 'Content invalid',
                    minLength: 'Konten harus diisi'
                }
            },
            author: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Author invalid',
                    minLength: 'Penulis harus diisi',
                    maxLength: 'Maksimal karakter penulis adalah 255'
                }
            }
        },
        required: ['title', 'content', 'author'],
    }
}

const deleteNewsSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

export { getNewsSchema, getNewsByIdSchema, postNewsSchema, updateNewsSchema, deleteNewsSchema }