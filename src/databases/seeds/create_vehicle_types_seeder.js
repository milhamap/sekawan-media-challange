/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('vehicle_types').del()
  await knex('vehicle_types').insert([
    {name: 'Stuff'},
    {name: 'People'},
  ]);
};
