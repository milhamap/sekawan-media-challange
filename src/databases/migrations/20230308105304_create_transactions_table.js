/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactions', (table) => {
        table.bigIncrements('id').primary();
        table.boolean('status').defaultTo(false).notNullable();
        table.boolean('is_returned').defaultTo(false).notNullable();
        table.datetime('return_date').nullable();
        table.bigInteger('vehicle_id').references('id').inTable('vehicles').notNullable();
        table.bigInteger('user_id').references('id').inTable('users').notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('transactions');
};
