const express = require('express')
const { createRole, getsRoles, updateRole, deleteRole } = require('../../resolvers/roles')
const { isAdmin } = require('../../middlewares')
const router = express.Router()

router.post('/', isAdmin, createRole)
router.get('/', isAdmin, getsRoles)
router.put('/:id', isAdmin, updateRole)
router.delete('/:id', isAdmin, deleteRole)

module.exports = router;