var express = require('express');
var router = express.Router();
const Utilisateurs = require('./schema_users');
var { checkTokenMiddleware } = require('../../jwtMiddleware');
const jwt = require('jsonwebtoken');


router.post('/', (req, res) => {
    // Missing password or username
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Error. Please enter the correct username and password'
        });
    }

    // Checking
    try {
        Utilisateurs.findAll({
            where: {
                Email: req.body.username,
                MotDePasse: req.body.password
            }
        }).then(function(user) {
            console.log(user)
            const token = jwt.sign({
                IdUser: user.IdUser,
                username: user.Email
            }, process.env.TOKEN_SECRET, {
                expiresIn: '3 hours'
            });

            return res.json({ access_token: token });
        });

    } catch (error) {
        return res.status(400).json({
            message: 'Error. Wrong login or password'
        });
    }
});

router.get('/tokeninfo', checkTokenMiddleware, (req, res) => {
    // Fetch token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);
    // Decode token
    const decoded = jwt.decode(token, {
        complete: false
    });

    return res.json({
        content: decoded
    });
});

router.post('/register', (req, res) => {
    // Missing password or username
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Error. Please enter username and password'
        });
    }

    // Utilisateurs.findAll({
    //     where: {
    //         Email: req.body.username
    //     }
    // }).then((user) => { console.log(user) });

    Utilisateurs.findAll({
        where: {
            Email: req.body.username
        }
    }).then(function(user){
        if (user) {
            return res.status(403).json({
                message: `Error. User ${req.body.username} already exists`
            });
        }
        Utilisateurs.create({
            Nom: req.body.Nom,
            Prenom: req.body.Prenom,
            Email: req.body.username,
            Adresse: req.body.Adresse,
            MotDePasse: req.body.password,
            DateDeNaissance: req.body.DateDeNaissance,
            DateInscription: new Date(), //today
            UserFlag: req.body.UserFlag,
            CodeParainage: Date.now() + Math.random().toString(36).substr(2, 9), //unique code based on timestamp
            NbParainages: 0,
        }).then((response) => {
            console.log(response)
            return res.status(201).json({
                message: `User created`
            });
        }).catch((error) => {
            return res.status(401).json({
                message: `User couldn't be created`,
                stackTrace: error
            });
        });
    });
});

module.exports = router;