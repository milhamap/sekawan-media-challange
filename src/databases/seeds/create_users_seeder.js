/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcrypt');
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const salt = await bcrypt.genSalt();
  const adminPassword = await bcrypt.hash('admin@headquarters.com', salt);
  const branchPassword = await bcrypt.hash('admin@branch.com', salt);
  await knex('users').del()
  await knex('users').insert([
    {email: 'admin@vale.com', password: adminPassword, role_id: 1, company_id: 1},
    {email: 'admin@valebranch.com', password: branchPassword, role_id: 1, company_id: 2}
  ]);
};
