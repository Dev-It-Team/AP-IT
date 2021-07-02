// see https://etienner.github.io/api-json-web-token-authentication-jwt-sur-express-js/

const jwt = require('jsonwebtoken');

const getToken = req => {
    return (req.headers.authorization && extractBearerToken(req.headers.authorization));
}

/* Récupération du header bearer */
const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    
    return matches && matches[2]
}

/* Vérification du token */
const checkTokenMiddleware = (req, res, next) => {
    // Récupération du token
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: 'TokenEmpty' })
    
    // Véracité du token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ message: 'BadToken' })
        } else {
            return next()
        }
    });
}

const checkUserRoleFlag = userFlags => {
    return async (req, res, next) => {
        try {
            // Récupération du token
            const token = getToken(req);
            if (!token) return res.status(401).json({ message: 'TokenEmpty' })

            // Véracité du token
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
                if (err) {
                    res.status(401).json({ message: 'BadToken' })
                } else {
                    for(flag of userFlags) {
                        if (decodedToken.UserFlag == flag)
                            return next();
                    }

                    return res.status(401).json({ message: 'WrongPermission' })
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    extractBearerToken,
    checkTokenMiddleware,
    checkUserRoleFlag,
    getToken
}