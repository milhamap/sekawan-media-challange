const knex = require('../../databases')
const Validator = require('fastest-validator')

const v = new Validator();

module.exports = {
    createTransactionByAdmin: async (req, res) => {
        const { vehicle_id, user_id } = req.body;
        try {
            const schema = {
                'vehicle_id': 'number|empty:false',
                'user_id': 'number|empty:false'
            }
            const validate = v.validate({
                vehicle_id,
                user_id
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            const vehicle = await knex('vehicles').where({ id: vehicle_id }).first();
            await knex('vehicles').where({ id: vehicle_id }).update({
                available: vehicle.available - 1
            });
            await knex('transactions').insert({
                vehicle_id,
                user_id,
                status: true
            });
            res.status(200).json({
                message: "Success Create Transaction"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    createTransactionByEmployee: async (req, res) => {
        const { vehicle_id } = req.body;
        try {
            const schema = {
                'vehicle_id': 'number|empty:false'
            }
            const validate = v.validate({
                vehicle_id
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            await knex('transactions').insert({
                vehicle_id,
                user_id: req.user.id
            });
            res.status(200).json({
                message: "Success Create Transaction"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getTransactions: async (req, res) => {
        try {
            const transactions = await knex('transactions')
            if (!transactions.length) return res.status(404).json({ message: "Transactions is Empty" });
            res.status(200).json({
                message: "Success Gets Transactions",
                transactions
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getTransaction: async (req, res) => {
        const { id } = req.params;
        try {
            const transaction = await knex('transactions').where({ id }).first()
            if (!transaction) return res.status(404).json({ message: "Transaction Not Found" });
            res.status(200).json({
                message: "Success Get Transaction",
                transaction
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    confirmTransaction: async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await knex('transactions').where({ id }).first();
            const vehicle = await knex('vehicles').where({ id: transaction.vehicle_id }).first();
            await knex('vehicles').where({ id: transaction.vehicle_id }).update({
                available: vehicle.available - 1
            });
            await knex('transactions').where({ id }).update({ status: true });
            res.status(200).json({
                message: "Success Confirm Transaction"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    reserveTransaction: async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await knex('transactions').where({ id }).first();
            if (transaction.is_returned == true) return res.status(400).json({ message: "Transaction is already returned" })
            const vehicle = await knex('vehicles').where({ id: transaction.vehicle_id }).first();
            await knex('vehicles').where({ id: transaction.vehicle_id }).update({ available: vehicle.available + 1 });
            await knex('transactions').where({ id }).update({ is_returned: true, return_date: new Date().toISOString() });
            res.status(200).json({
                message: "Success Reserve Transaction"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    deleteTransaction: async (req, res) => {
        try {
            const { id } = req.params;
            await knex('transactions').where({ id }).del();
            res.status(200).json({
                message: "Success Delete Transaction"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}