const knex = require('../../databases')
const Validator = require('fastest-validator')

const v = new Validator();

module.exports = {
    createRole: async (req, res) => {
        const { name } = req.body;
        try {
            const schema = {
                'name': 'string|empty:false'
            }
            const validate = v.validate({
                name
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            await knex('roles').insert({
                name
            });
            res.status(200).json({
                message: "Success Create Role"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsRoles: async (req, res) => {
        try {
            const role = await knex('roles')
            res.status(200).json({
                message: "Success Gets Role",
                role
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    updateRole: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const schema = {
                'name': 'string|empty:false'
            }
            const validate = v.validate({
                name
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            await knex('roles').where({ id }).update({
                name
            });
            res.status(200).json({
                message: "Success Update Role"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    deleteRole: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await knex('users').where({ role_id: id });
            user.forEach(async (item) => {
                await knex('users').where({ id: item.id }).del();
            })
            await knex('roles').where({ id }).del();
            res.status(200).json({
                message: "Success Delete Role"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}