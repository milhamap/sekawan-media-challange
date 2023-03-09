const knex = require('../../databases')
const Validator = require('fastest-validator')

const v = new Validator();

module.exports = {
    createVehicle: async (req, res) => {
        const { name, capacity_bbm, type, total, vehicle_type_id } = req.body;
        try {
            const schema = {
                'name': 'string|empty:false',
                'capacity_bbm': 'number|empty:false',
                'type': 'string|empty:false',
                'total': 'number|empty:false',
                'vehicle_type_id': 'number|empty:false'
            }
            const validate = v.validate({
                name, capacity_bbm, type, total, vehicle_type_id
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            await knex('vehicles').insert({
                name, capacity_bbm, type, total, vehicle_type_id, user_id: req.user.id, available: total
            });
            res.status(200).json({
                message: "Success Create Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsVehicles: async (req, res) => {
        try {
            const vehicle = await knex('vehicles').where({ user_id: req.user.id })
            if (!vehicle.length) return res.status(404).json({ message: "Vehicle is Empty" });
            res.status(200).json({
                message: "Success Gets Vehicle",
                vehicle
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getVehicle: async (req, res) => {
        const { id } = req.params;
        try {
            const vehicle = await knex('vehicles').where({ id }).first()
            res.status(200).json({
                message: "Success Get Vehicle",
                vehicle
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },   
    updateVehicle: async (req, res) => {
        const { id } = req.params;
        const { name, capacity_bbm, type, total, vehicle_type_id } = req.body;
        try {
            const schema = {
                'name': 'string|empty:false',
                'capacity_bbm': 'number|empty:false',
                'type': 'string|empty:false',
                'total': 'number|empty:false',
                'vehicle_type_id': 'number|empty:false'
            }
            const validate = v.validate({
                name, capacity_bbm, type, total, vehicle_type_id
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            const vehicle = await knex('vehicles').where({ id }).first();
            const result = total - vehicle.total;
            await knex('vehicles').where({ id }).update({
                name, capacity_bbm, type, total, vehicle_type_id, available: vehicle.available + result
            });
            res.status(200).json({
                message: "Success Update Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    deleteVehicle: async (req, res) => {
        const { id } = req.params;
        try {
            const service = await knex('service_vehicles').where({ vehicle_id: id });
            service.map(async (item) => {
                await knex('service_vehicle_details').where({ service_id: item.id }).del();
                await knex('service_vehicles').where({ id: item.id }).del();
            })
            await knex('transactions').where({ vehicle_id: id }).del();
            await knex('vehicles').where({ id }).del();
            res.status(200).json({
                message: "Success Delete Vehicle"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}