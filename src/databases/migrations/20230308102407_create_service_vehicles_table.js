/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('service_vehicles', (table) => {
        table.bigIncrements('id').primary();
        table.datetime('date').notNullable();
        table.bigInteger('vehicle_id').references('id').inTable('vehicles').notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('service_vehicles');   
};
