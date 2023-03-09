/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('companies').del()
  await knex('companies').insert([
    {type: 'Headquarters', address: 'Rua 1, 123'},
    {type: 'Branch Office', address: 'Rua 2, 456'}
  ]);
};
