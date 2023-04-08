/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("riddles").truncate();
  await knex("users").truncate();
  await knex("roles").truncate();

  await knex("roles").insert([
    {
      role_name: "admin",
    },
    {
      role_name: "user",
    },
  ]);
};
