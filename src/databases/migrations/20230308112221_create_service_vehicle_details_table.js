/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('service_vehicle_details', (table) => {
        table.bigIncrements('id').primary();
        table.date('date').notNullable();
        table.boolean('is_returned').defaultTo(false).notNullable();
        table.bigInteger('service_id').references('id').inTable('service_vehicles').notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('service_vehicle_details');
};
