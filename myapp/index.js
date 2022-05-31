const Joi = require('@hapi/joi');
const express = require('express');
const app = express();
const validate = require('express-joi-validate');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let userList = [];
userList.push({
        id       : 1,
        login    : 'logged in',
        password : 'test@123',
        age      : 12,
        isDeleted: false
    },
    {
        id       : 2,
        login    : 'logged in',
        password : 'test@345',
        age      : 18,
        isDeleted: false
    },
    {
        id: 3,
        login: 'logged in',
        password: 'test@567',
        age: 21,
        isDeleted: false
    }
    );

const userIdSchema = Joi.string().required();
const userSchema = {
    login: Joi.string().required(),
    password: Joi.string().regex(/(?=.*[0-9])(?=.*[A-Za-z])/).required(),
    age: Joi.number().integer().min(4).max(130).required()
};

const AutoSuggestUserSchema = {
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
        body: AutoSuggestUserSchema
    }
};

app.get('/api/getUsers', validate(userIdSchema), (req, res) => {
    res.send(userList);
});

app.get('/api/getUser/:id', validate(validateSchemas.getUserById), (req, res) => {
    const user = userList.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The course with the given ID was not found');
    res.send(user);
});

app.post('/api/createUser', validate(validateSchemas.createUser),(req, res) => {
    const newUser = {
        id: userList.length +1,
        login: req.body.login,
        password: req.body.password,
        age: req.body.age,
        isDeleted: false
    };
    userList.push(newUser);
    res.send(newUser);
});

app.put('/api/updateUser/:id', validate(validateSchemas.updateUser), (req, res) => {
    const newUser = req.body;
    updateUser(newUser);
    res.json(newUser);
});

app.get('/api/getAutoSuggestUsers', validate(validateSchemas.getAutoSuggestUsers), (req, res) => {
    try {
        const loginSubstring = req.query.login;
        const limit = req.query.limit;
        const result = getAutoSuggestUsers(loginSubstring, limit);
        if (!result.length) {
            res.sendStatus(404);
        }
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.delete('/api/deleteUser/:id', validate(validateSchemas.deleteUser), (req, res) => {
    const user = {
        id: req.params.id
    };
    deleteUser(user);
    res.json(user);
});

function getAutoSuggestUsers(loginSubstring, limit) {
    const filteredUsers = userList.sort((a, b) => {
        if (a.login < b.login) return -1;
        if (a.login > b.login) return 1;
        return 0;
    }).filter(user => user.login.toLowerCase().indexOf(loginSubstring) > -1);
    if (filteredUsers.length > 1) return filteredUsers.slice(0, limit);
    return [];
}

const deleteUser = (user) => {
    if (!user) return;
    const deletedUser = userList.find(item => item && item.id === user.id);
    if (!deletedUser) return;
    deletedUser.isDeleted = true;
};

const updateUser = (newUser) => {
    removeUser(newUser);
    userList.push(newUser);
};

const removeUser = (newUser) => {
    if (!newUser) return;
    const userIndex = userList.findIndex(user => user && user.id === newUser.id);
    if (userIndex < 0) return;
    userList = userList
        .slice(0, userIndex)
        .concat(userList.slice(userIndex + 1, userList.length));
};

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`List ${port}`));
