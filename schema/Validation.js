const Joi = require('@hapi/joi');

const userIdSchema = Joi.string().required();
const userSchema = {
    login: Joi.string().required(),
    password: Joi.string().regex(/(?=.*[0-9])(?=.*[A-Za-z])/).required(),
    age: Joi.number().integer().min(4).max(130).required()
};

const autoSuggestUserSchema = {
    loginSubstring: Joi.string().required(),
    limit: Joi.number().integer()
};

const validateSchemas = {
    getUserById: {
        params: {
            id: userIdSchema
        }
    },
    createUser: {
        body: userSchema
    },
    updateUser: {
        body: userSchema
    },
    deleteUser: {
        params: {
            id: userIdSchema
        }
    },
    getAutoSuggestUsers: {
        body: autoSuggestUserSchema
    }
};

module.exports = {userIdSchema, validateSchemas};
