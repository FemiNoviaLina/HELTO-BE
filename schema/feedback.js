const feedbackSchema = {
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
    feedback: {
        type: 'string',
        minLength: 1,
        errorMessage: {
            type: 'Feedback invalid'
        }
    } 
}

export { feedbackSchema }