var express = require('express');
var router = express.Router();
const {checkTokenMiddleware, extractBearerToken} = require('../jwtMiddleware')
const jwt = require('jsonwebtoken');


const users = [
    { id: 1, username: 'admin', password: 'password123' }
]

router.post('/login', (req, res) => {
    // Missing password or username
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Error. Please enter the correct username and password'
        })
    }

    // Checking
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password)

    // Unknown user
    if (!user) {
        return res.status(400).json({
            message: 'Error. Wrong login or password'
        })
    }

    const token = jwt.sign({
        id: user.id,
        username: user.username
    }, process.env.TOKEN_SECRET, { expiresIn: '3 hours' })

    return res.json({ access_token: token })
});

router.get('/tokeninfo', checkTokenMiddleware, (req, res) => {
    // Fetch token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    // Decode token
    const decoded = jwt.decode(token, { complete: false })

    return res.json({ content: decoded })
})

module.exports = router;