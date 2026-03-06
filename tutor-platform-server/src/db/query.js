const pool = require("./pool");

async function query(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

module.exports = { query };
