var express = require('express');
var router = express.Router();
const Users = require('./schema_users');
const { extractBearerToken, checkTokenMiddleware } = require('../../jwtMiddleware');
const jwt = require('jsonwebtoken');

/**
 * @api {post} /login/ Create Users information
 * @apiVersion 1.0.0
 * @apiName PostLogin
 * @apiGroup Users
 * 
 * @apiParam {String} Email User's email.
 * @apiParam {String} MotDePasse  User's password.
 * 
 * @apiSuccess {String} token  User authentication token.
 *
 * @apiError UserNotLoggedIn The user cannot be logged in.
 */
/**
 * @api {post} /login/ Create Users information
 * @apiVersion 1.1.0
 * @apiName PostLogin
 * @apiGroup Users
 * 
 * @apiParam {String} Email User's email.
 * @apiParam {String} Password  User's password.
 * 
 * @apiSuccess {String} token  User authentication token.
 *
 * @apiError UserNotLoggedIn The user cannot be logged in.
 */
router.post('/', (req, res) => {
    // Missing Password or Email
    if (!req.body.Email || !req.body.Password) {
        return res.status(400).json({
            message: 'Error. Please enter the correct Email and Password'
        });
    }

    // Checking
    Users.findOne({
        where: {
            Email: req.body.Email,
            Password: req.body.Password
        }
    }).then(function(user) {
        if (!user) return res.status(401).json({
            message: 'Error. Wrong login or Password'
        });

        const token = jwt.sign({
            IdUser: user.IdUser,
            Email: user.Email,
            UserFlag: user.UserFlag
        }, process.env.TOKEN_SECRET, {
            expiresIn: '3 hours'
        });

        return res.status(201).json({ access_token: token });
    }).catch(error => {
        console.error(error);
    });
});


/**
 * @api {post} /login/register/ Create Users information
 * @apiVersion 1.0.0
 * @apiName PostUsers
 * @apiGroup Users
 * 
 * @apiParam {String} Nom User's name.
 * @apiParam {String} Prenom  User's firstname.
 * @apiParam {String} Email  Email of the user.
 * @apiParam {String} MotDePasse User's password.
 * @apiParam {Date} DateDeNaissance  Birthdate of the user.
 * @apiParam {String} Adresse  User's address.
 * @apiParam {Date} DateInscription Date when the user create its account.
 * @apiParam {String} CodeParainage  Unique code that permits the user to patron someone.
 * @apiParam {Number} NbParainages Number of patronage.
 * @apiParam {String} UserFlag  Type of user.
 * 
 * @apiSuccess {String} message  Users created.
 *
 * @apiError UserNotCreated The user cannot be created.
 */
router.get('/tokeninfo', checkTokenMiddleware, (req, res) => {
    // Fetch token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);
    // Decode token
    const decoded = jwt.decode(token, {
        complete: true,
        json: true,
    });

    return res.json(decoded.payload);
});

/**
 * @api {post} /login/register/ Create Users information
 * @apiVersion 1.0.0
 * @apiName PostUsers
 * @apiGroup Users
 * 
 * @apiParam {String} Nom User's name.
 * @apiParam {String} Prenom  User's firstname.
 * @apiParam {String} Email  Email of the user.
 * @apiParam {String} MotDePasse User's password.
 * @apiParam {Date} DateDeNaissance  Birthdate of the user.
 * @apiParam {String} Adresse  User's address.
 * @apiParam {Date} DateInscription Date when the user create its account.
 * @apiParam {String} CodeParainage  Unique code that permits the user to patron someone.
 * @apiParam {Number} NbParainages Number of patronage.
 * @apiParam {String} UserFlag  Type of user.
 * 
 * @apiSuccess {String} message  Users created.
 *
 * @apiError UserNotCreated The user cannot be created.
 */
/**
 * @api {post} /login/register/ Create Users information
 * @apiVersion 1.1.0
 * @apiName PostUsers
 * @apiGroup Users
 * 
 * @apiParam {String} Name User's name.
 * @apiParam {String} FirstName  User's firstname.
 * @apiParam {String} Email  Email of the user.
 * @apiParam {String} Password User's password.
 * @apiParam {Date} BirthDate  Birthdate of the user.
 * @apiParam {String} Address  User's address.
 * @apiParam {Date} InscriptionDate Date when the user create its account.
 * @apiParam {String} PatronageCode  Unique code that permits the user to patron someone.
 * @apiParam {Number} PatronageNb Number of patronage.
 * @apiParam {String} UserFlag  Type of user.
 * 
 * @apiSuccess {String} message  Users created.
 *
 * @apiError UserNotCreated The user cannot be created.
 */
router.post('/register', (req, res) => {
    // Missing Password or Email
    if (!req.body.Email || !req.body.Password) {
        return res.status(400).json({
            message: 'Error. Please enter Email and Password'
        });
    }

    Users.findOne({
        where: {
            Email: req.body.Email
        }
    }).then(function(user){
        if (user) {
            return res.status(403).json({
                message: `Error. User ${req.body.Email} already exists`
            });
        }
        Users.create({
            Name: req.body.Name,
            FirstName: req.body.FirstName,
            Email: req.body.Email,
            Address: req.body.Address,
            Password: req.body.Password,
            BirthDate: req.body.BirthDate,
            InscriptionDate: new Date(), //today
            UserFlag: req.body.UserFlag,
            PatronageCode: Date.now() + Math.random().toString(36).substr(2, 9), //unique code based on timestamp
            PatronageNb: 0,
        }).then((response) => {
            return res.status(201).json({
                message: `User created`
            });
        }).catch((error) => {
            return res.status(401).json({
                message: `User couldn't be created`,
                stackTrace: error
            });
        });
    }).catch((error) => {
        return res.status(401).json({
            message: `User couldn't be created`,
            stackTrace: error
        });
    });
});

module.exports = router;