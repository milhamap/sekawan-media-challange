const express = require('express')
const { createTransactionByAdmin, createTransactionByEmployee, getTransactions, getTransaction, confirmTransaction, reserveTransaction, deleteTransaction } = require('../../resolvers/transactions')
const { isAdmin, isEmployee, verifyToken } = require('../../middlewares')
const router = express.Router()

router.post('/admin', isAdmin, createTransactionByAdmin)
router.post('/employee', isEmployee, createTransactionByEmployee)
router.get('/', verifyToken, getTransactions)
router.get('/:id', verifyToken, getTransaction)
router.put('/confirm/:id', isAdmin, confirmTransaction)
router.put('/reserve/:id', isEmployee, reserveTransaction)
router.delete('/:id', verifyToken, deleteTransaction)

module.exports = router