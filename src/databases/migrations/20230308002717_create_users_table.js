/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();
        table.string('name').nullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('phone', 13).nullable().unique();
        table.bigInteger('role_id').references('id').inTable('roles').notNullable();
        table.bigInteger('company_id').references('id').inTable('companies').notNullable();
        table.string('refreshToken').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
