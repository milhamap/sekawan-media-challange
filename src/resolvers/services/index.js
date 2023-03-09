const knex = require('../../databases')
const Validator = require('fastest-validator')

const v = new Validator();
const weekday = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

module.exports = {
    createScheduleServiceVehicle: async (req, res) => {
        const { date, vehicle_id } = req.body;
        try {
            const schema = {
                'date': 'string|empty:false'
            }
            const validate = v.validate({
                date
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            await knex('service_vehicles').insert({
                date,
                vehicle_id
            });
            res.status(200).json({
                message: "Success Create Service Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsScheduleServiceVehicles: async (req, res) => {
        try {
            // join lebih dari 1 table
            const serviceVehicle = await knex({sv :'service_vehicles'}).join({v:'vehicles'}, 'sv.vehicle_id', 'v.id').join({u:'users'}, 'v.user_id', 'u.id').where('u.company_id', req.user.company_id).select('sv.id', 'sv.date', 'sv.vehicle_id', 'sv.created_at', 'sv.updated_at')
            if (!serviceVehicle.length) return res.status(404).json({ message: "Service Vehicle is Empty" });
            const service = serviceVehicle.map(async(item) => {
                let date = new Date(item.date)
                let day = weekday[date.getDay()]
                item.date = day
            })
            await Promise.all(service)
            res.status(200).json({
                message: "Success Gets Service Vehicle",
                serviceVehicle
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getScheduleServiceVehicle: async (req, res) => {
        const { id } = req.params;
        try {
            const serviceVehicle = await knex('service_vehicles').where({ id }).first()
            if (!serviceVehicle) return res.status(404).json({ message: "Service Vehicle Not Found" });
            res.status(200).json({
                message: "Success Get Service Vehicle",
                serviceVehicle
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    deleteScheduleServiceVehicle: async (req, res) => {
        const { id } = req.params;
        try {
            await knex('service_vehicle_details').where({ service_id: id }).del();
            await knex('service_vehicles').where({ id }).del();
            res.status(200).json({
                message: "Success Delete Service Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    createServiceVehicle: async (req, res) => {
        const { vehicle_id, date } = req.body;
        try {
            const service = await knex('service_vehicles').where({ vehicle_id })
            const date_service = new Date(new Date(date))
            const day_service = weekday[date_service.getDay()]
            console.log(day_service)
            let result = 0
            service.map(async (item) => {
                let date = new Date(item.date)
                let day = weekday[date.getDay()]
                console.log(day)
                item.date = day
                if (day_service == day) result++;
            })
            console.log(result)
            if (!service.length) return res.status(400).json({ message: "Service Vehicle Not Found" });
            if (result == 0) return res.status(400).json({ message: "Schedule Not Available" });
            const vehicle = await knex('vehicles').where({ id: service[0].vehicle_id })
            if (vehicle[0].available == 0) return res.status(400).json({ message: "Vehicle Not Available" });
            await knex('vehicles').update({
                available: vehicle[0].available - 1
            }).where({ id: vehicle_id });
            await knex('service_vehicle_details').insert({
                service_id: service[0].id,
                date
            });
            res.status(200).json({
                message: "Success Create Service Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    confirmServiceVehicle: async (req, res) => {
        const { id } = req.params;
        try {
            const service_vehicle_confirm = await knex('service_vehicle_details').where({ id }).first()
            console.log(service_vehicle_confirm)
            if (service_vehicle_confirm.is_returned) return res.status(400).json({ message: "Service Vehicle Already Confirmed" });
            const service_vehicle = await knex({sv: 'service_vehicles'}).join({svd: 'service_vehicle_details'}, 'sv.id', 'svd.service_id').first()
            const vehicle = await knex('vehicles').where({ id: service_vehicle.vehicle_id }).first()
            console.log(vehicle)
            await knex('vehicles').update({
                    available: vehicle.available + 1
                }).where({ id: vehicle.id });
            const service = await knex('service_vehicle_details').update('is_returned', true).where({ id });
            if (!service) return res.status(404).json({ message: "Service Vehicle Not Found" });
            res.status(200).json({
                message: "Success Confirm Service Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsReversedServiceVehicle: async (req, res) => {
        try {
            const serviceVehicle = await knex({svd: 'service_vehicle_details'}).join({sv: 'service_vehicles'}, 'svd.service_id', 'sv.id').join({v: 'vehicles'}, 'sv.vehicle_id', 'v.id').join({u: 'users'}, 'v.user_id', 'u.id').where('u.company_id', req.user.company_id).select('svd.id', 'svd.date', 'svd.is_returned', 'svd.created_at', 'svd.updated_at').where({ is_returned: true })
            if (!serviceVehicle.length) return res.status(404).json({ message: "Service Vehicle is Empty" });
            res.status(200).json({
                message: "Success Gets Service Vehicle",
                serviceVehicle
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsWaitingServiceVehicle: async (req, res) => {
        try {
            const serviceVehicle = await knex({svd: 'service_vehicle_details'}).join({sv: 'service_vehicles'}, 'svd.service_id', 'sv.id').join({v: 'vehicles'}, 'sv.vehicle_id', 'v.id').join({u: 'users'}, 'v.user_id', 'u.id').where('u.company_id', req.user.company_id).select('svd.id', 'svd.date', 'svd.is_returned', 'svd.created_at', 'svd.updated_at').where({ is_returned: false })
            if (!serviceVehicle.length) return res.status(404).json({ message: "Service Vehicle is Empty" });
            res.status(200).json({
                message: "Success Gets Service Vehicle",
                serviceVehicle
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getServiceVehicle: async (req, res) => {
        const { id } = req.params;
        try {
            const serviceVehicle = await knex('service_vehicle_details').where({ id }).first()
            if (!serviceVehicle) return res.status(404).json({ message: "Service Vehicle Not Found" });
            res.status(200).json({
                message: "Success Get Service Vehicle",
                serviceVehicle
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    deleteServiceVehicle: async (req, res) => {
        const { id } = req.params;
        try {
            await knex('service_vehicle_details').where({ id }).del();
            res.status(200).json({
                message: "Success Delete Service Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}