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
    if (!token) return res.status(401).json({ message: 'Error. Need a token' })
    
    // Véracité du token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ message: 'Error. Bad token' })
        } else {
            return next()
        }
    });
}

const checkUserRoleFlag = userFlag => {
    return async (req, res, next) => {
        try {
            // Récupération du token
            const token = getToken(req);
            if (!token) return res.status(401).json({ message: 'Error. Need a token' })

            // Véracité du token
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
                if (err) {
                    res.status(401).json({ message: 'Error. Bad token' })
                } else {
                    if (decodedToken.UserFlag == userFlag)
                        return next();
                    return res.status(401).json({ message: 'Error. Wrong permission.' })
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
}