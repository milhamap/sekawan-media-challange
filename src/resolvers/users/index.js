const knex = require('../../databases')
const Validator = require('fastest-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { formatPhoneNumber } = require('../../helpers/phone')
const { createUserToken, createRefreshToken } = require('../../helpers/token')

const v = new Validator();

module.exports = {
    register: async (req, res) => {
        const { email, password, confirmPassword, name, phone } = req.body;
        try {
            const phoneNumber = formatPhoneNumber(phone);
            const schema = {
                'email': 'email|empty:false',
                'password': 'string|min:6|same:confirmPassword',
                'confirmPassword': 'string|min:6|same:password',
                'name': 'string|empty:false',
                'phoneNumber': 'string|empty:false|max:13'
            }
            const validate = v.validate({
                email,
                password,
                confirmPassword,
                name,
                phoneNumber
            }, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            if (await knex('users').where({email: email}).orWhere({phone: phoneNumber}).then(data => data.length)) return res.status(400).json({ message: "Email or phone number already exists" });
            if (password !== confirmPassword) return res.status(400).json({ message: "Password or email not match" });
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            await knex('users').insert({
                email,
                password: hashedPassword,
                name,
                phone: phoneNumber,
                role_id: 2,
                company_id: req.user.company_id,
            });
            res.status(200).json({
                message: "User created"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const schema = {
                'email': 'email|empty:false',
                'password': 'string|min:6'
            }
            const validate = v.validate(req.body, schema);
            if (validate.length) return res.status(400).json({ message: validate[0].message });
            const user = await knex('users').where({ email: email}).first();
            if (!user) return res.status(400).json({ message: "Email or password is wrong" });
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(400).json({ message: "Email or password is wrong" });
            const token = createUserToken({
                id: user.id,
                email: user.email,
                company_id: user.company_id,
                role_id: user.role_id
            });
            const refreshToken = createRefreshToken({
                id: user.id,
                email: user.email,
                company_id: user.company_id,
                role_id: user.role_id
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            await knex('users').where({ id: user.id }).update({ refreshToken: refreshToken });
            res.status(200).json({
                message: "Login success",
                user,
                token,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) return res.status(400).json({message: "Refresh Token expired!"})
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403)
                const token = createUserToken({
                    id: user.id,
                    email: user.email,
                    company_id: user.company_id,
                    role_id: user.role_id    
                })
                res.status(200).json({
                    message: "Refresh Token success",
                    token
                })
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    logout: async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(204)
        const user = await knex('users').where('refreshToken', refreshToken).first()
        if (!user) return res.sendStatus(204)
        await knex('users').where({id: user.id}).update({refreshToken: null})
        res.clearCookie('refreshToken')
        res.status(200).json({message: "Logout Success"})
    },
    getUser: async (req, res) => {
        try {
            const user = await knex({u: 'users'}).where('id', req.user.id).first()
            res.status(200).json({
                message: "Get User",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    updateAuthentication: async (req, res) => {
        try {
            const { email, old_password, new_password, new_confirm_password } = req.body;
            const schema = {
                'email': 'email|empty:false',
                'old_password': 'string|min:8|empty:false',
                'new_password': 'string|min:8|empty:false|same:new_confirm_password',
                'new_confirm_password': 'string|min:8|empty:false|same:new_password'
            }
            const validate = v.validate(req.body, schema)
            if (validate.length) return res.status(400).json(validate)
            const user = await knex('users').where('id', req.user.id).first()
            if (await knex('users').where('email', email).then(data => data.length) > 1) return res.status(400).json({message: "Email already exist"})
            if (new_password !== new_confirm_password) return res.status(400).json({message: "Password not match"})
            const validatePassword = await bcrypt.compare(old_password, user.password)
            if (!validatePassword) return res.status(400).json({message: 'Password not match'})
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(new_password, salt)
            await knex('users').where('id', req.user.id).update({
                email,
                password: hashedPassword
            })
            res.status(200).json({
                message: "Update Password Success"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}