const express = require('express')
const { register, login, logout, refreshToken, getUser, updateAuthentication } = require('../../resolvers/users')
const { isAdmin, verifyToken } = require('../../middlewares')
const router = express.Router()

router.post('/employee/register', isAdmin, register)
router.post('/login', login)
router.put('/update-auth', verifyToken, updateAuthentication)
router.get('/', verifyToken, getUser)
router.get('/refresh-token', refreshToken)
router.delete('/logout', logout)

module.exports = router;