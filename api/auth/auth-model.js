const db = require("../../data/dbConfig");

const getAll = async () => {
  return await db("users");
};

const getByUser = async (profile) => {
  return await db("users as u")
    .leftJoin("roles as r", "u.role_id", "r.role_id")
    .select("u.*", "r.role_name")
    .where(profile)
    .first();
};
const insertUser = async (profile) => {
  const { role_id } = await db("roles")
    .where("role_name", profile.role_name)
    .first();
  const model = {
    username: profile.username,
    password: profile.password,
    role_id: role_id,
  };
  const added = await db("users").insert(model);

  return getByUser({ "u.user_id": added[0] });
};
module.exports = {
  getAll,
  getByUser,
  insertUser,
};
