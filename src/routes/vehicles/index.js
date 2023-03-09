const express = require('express')
const { createVehicle, getsVehicles, getVehicle, updateVehicle, deleteVehicle } = require('../../resolvers/vehicles')
const { isAdmin } = require('../../middlewares')
const router = express.Router()

router.post('/', isAdmin, createVehicle)
router.get('/', isAdmin, getsVehicles)
router.get('/:id', isAdmin, getVehicle)
router.put('/:id', isAdmin, updateVehicle)
router.delete('/:id', isAdmin, deleteVehicle)

module.exports = router;