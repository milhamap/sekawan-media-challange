// Update with your config settings.
require('dotenv').config()
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: `postgres://${process.env.PGUSER_DEV}:${process.env.PGPASSWORD_DEV}@${process.env.PGHOST_DEV}/${process.env.PGDATABASE_DEV}`,
    migrations: {
        directory: './src/databases/migrations'
    },
    seeds: {
        directory: './src/databases/seeds'
    },
    ssl: {
        rejectUnauthorized: false
    }
  },
};
