const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.headers['authorization'];
        const authToken = token && token.split(' ')[1];
        if (!authToken) return res.sendStatus(401);
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    },
    isAdmin: (req, res, next) => {
        const token = req.headers['authorization'];
        const authToken = token && token.split(' ')[1];
        if (!authToken) return res.sendStatus(401);
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            if (user.role_id != 1) return res.status(400).json({ message: "You aren't Admin" })
            req.user = user;
            next();
        })
    },
    isEmployee: (req, res, next) => {
        const token = req.headers['authorization'];
        const authToken = token && token.split(' ')[1];
        if (!authToken) return res.sendStatus(401);
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            if (user.role_id != 2) return res.status(400).json({ message: "You aren't Employee" })
            req.user = user;
            next();
        })
    }
}