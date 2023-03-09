const express = require('express')
const { createScheduleServiceVehicle, getsScheduleServiceVehicles, getScheduleServiceVehicle, deleteScheduleServiceVehicle, createServiceVehicle, confirmServiceVehicle, getsReversedServiceVehicle, getsWaitingServiceVehicle, deleteServiceVehicle, getServiceVehicle } = require('../../resolvers/services')
const { isAdmin } = require('../../middlewares')
const router = express.Router()

router.post('/schedule', isAdmin, createScheduleServiceVehicle)
router.get('/schedule', isAdmin, getsScheduleServiceVehicles)
router.get('/schedule/:id', isAdmin, getScheduleServiceVehicle)
router.delete('/schedule/:id', isAdmin, deleteScheduleServiceVehicle)
router.post('/', isAdmin, createServiceVehicle)
router.put('/confirm/:id', isAdmin, confirmServiceVehicle)
router.get('/reversed', isAdmin, getsReversedServiceVehicle)
router.get('/waiting', isAdmin, getsWaitingServiceVehicle)
router.get('/:id', isAdmin, getServiceVehicle)
router.delete('/:id', isAdmin, deleteServiceVehicle)

module.exports = router