// authentication 
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); 
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user;  
        next();
    });
};



// roleMiddleware.js
const checkRole = (roles) => {
    return (req, res, next) => {
        console.log(req.user)
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = {checkRole,authenticateToken};
