const express = require('express');
const app = express();
const validate = require('express-joi-validate');
const {userIdSchema, validateSchemas} = require('schema/Validation');
const {deleteUser, updateUser, getAutoSuggestUsers} = require('controllers/restOp');
let userList = require('db/UsersList');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`List ${port}`));
