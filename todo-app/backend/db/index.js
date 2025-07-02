// Kết nối PostgreSQL
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todoapp",
  password: "123456",
  //   database: "todo_app", // CSDL trong pg
  //   password: "your_password", // Pass trong pg
  port: 5432,
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("Kết nối thành công! Time:", res.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi kết nối:", err.message);
  } finally {
    pool.end();
  }
})();
module.exports = pool;
