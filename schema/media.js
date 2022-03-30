const getMediaSchema = {
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

const getMediaByIdSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

const postMediaSchema = {
    body: {
        type: 'object',
        properties: {
            link: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Media invalid',
                    minLength: 'Media harus diisi',
                    maxLength: 'Maksimal karakter media adalah 255'
                }
            },
            description: {
                type: 'string',
                minLength: 1,
                errorMessage: {
                    type: 'Deskripsi invalid',
                    minLength: 'Deskripsi harus diisi'
                }
            }
        },
        required: ['link', 'description']
    }
}

const updateMediaSchema = {
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
            link: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                errorMessage: {
                    type: 'Link invalid',
                    minLength: 'Judul harus diisi',
                    maxLength: 'Maksimal karakter judul adalah 255'
                }
            },
            description: {
                type: 'string',
                minLength: 1,
                errorMessage: {
                    type: 'Deskripsi invalid',
                    minLength: 'Deskripsi harus diisi'
                }
            }
        }
    }
}

const deleteMediaSchema = {
    params: {
        id: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Id invalid'
        }
    }
}

export { getMediaSchema, getMediaByIdSchema, postMediaSchema, updateMediaSchema, deleteMediaSchema }