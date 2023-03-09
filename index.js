const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config();

const roleRouter = require('./src/routes/roles')
const userRouter = require('./src/routes/users')
const vehicleRouter = require('./src/routes/vehicles')
const serviceRouter = require('./src/routes/services')
const transactionRouter = require('./src/routes/transactions')

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/roles', roleRouter)
app.use('/users', userRouter)
app.use('/vehicles', vehicleRouter)
app.use('/services', serviceRouter)
app.use('/transactions', transactionRouter)

app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
})

module.exports = app;