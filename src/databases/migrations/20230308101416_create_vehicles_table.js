/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('vehicles', (table) => {
        table.bigIncrements('id').primary();
        table.string('name').notNullable();
        table.integer('capacity_bbm').notNullable();
        table.enum('type', ['owned', 'rent']).notNullable();
        table.integer('total').notNullable();
        table.integer('available').notNullable();
        table.bigInteger('vehicle_type_id').references('id').inTable('vehicle_types').notNullable();
        table.bigInteger('user_id').references('id').inTable('users').notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('vehicles');
};
