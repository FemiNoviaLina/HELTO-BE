const createPostSchema = {
    body: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                minLength: 1,
                errorMessage: {
                    type: 'Content invalid',
                    minLength: 'Content terlalu pendek'
                }
            },
            replyToId: {
                type: 'number',
                errorMessage: {
                    type: 'Reply to id invalid'
                }
            }
        },
        required: ['content'],
    }, 
    params: {
        key: {
            type: 'string',
            minLength: 1,
            errorMessage: 'Key invalid'
        }
    }
}

const getPostByIdSchema = {
    params: {
        key: {
            type: 'string',
            minLength: 1,
            errorMessage: 'Key invalid'
        },
        id: {
            type: 'number',
            errorMessage: 'Id invalid'
        }
    }
}

const getPostSchema = {
    params: {
        key: {
            type: 'string',
            minLength: 1,
            errorMessage: 'Key invalid'
        }
    },
    querystring: {
        limit: {
            type: 'number',
            minimum: 1,
            maximum: 100,
            errorMessage: 'Limit invalid'
        },
        offset: {
            type: 'number',
            minimum: 0,
            errorMessage: 'Offset invalid'
        },
        region: {
            type: 'string',
            minLength: 1,
            errorMessage: 'Region invalid'
        }
    }
}

const likePostSchema = {
    params: {
        key: {
            type: 'string',
            minLength: 1,
            errorMessage: 'Key invalid'
        },
        id: {
            type: 'number',
            errorMessage: 'Id invalid'
        }
    }
}

export { createPostSchema, getPostByIdSchema, getPostSchema, likePostSchema }