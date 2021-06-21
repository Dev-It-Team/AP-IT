var express = require('express');
var router = express.Router();
const {checkTokenMiddleware, extractBearerToken} = require('../jwtMiddleware');
const jwt = require('jsonwebtoken');


const users = [
    { id: 1, username: 'admin', password: 'password123' }
]

router.post('/login', (req, res) => {
    // Missing password or username
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Error. Please enter the correct username and password'
        });
    }

    // Checking
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password);

    // Unknown user
    if (!user) {
        return res.status(400).json({
            message: 'Error. Wrong login or password'
        });
    }

    const token = jwt.sign({
        id: user.id,
        username: user.username
    }, process.env.TOKEN_SECRET, { expiresIn: '3 hours' });

    return res.json({ access_token: token });
});

router.get('/tokeninfo', checkTokenMiddleware, (req, res) => {
    // Fetch token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);
    // Decode token
    const decoded = jwt.decode(token, { complete: false });

    return res.json({ content: decoded });
});

router.post('/register', (req, res) => {
    // Missing password or username
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Error. Please enter username and password' });
    }

    const userExists = users.find(u => u.username === req.body.username);
    if (userExists) {
        return res.status(400).json({ message: `Error. User ${req.body.username} already exists` });
    }

    // Insert new user
    const id = users[users.length - 1].id + 1
    const newUser = {
        id: id,
        username: req.body.username,
        password: req.body.password
    }
    users.push(newUser);

    return res.status(201).json({ message: `User ${id} created` });
});

module.exports = router;