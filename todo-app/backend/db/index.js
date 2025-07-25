// Kết nối PostgreSQL
const { Pool } = require("pg");

const pool = new Pool({
  user: "dka12345",
  host: "dpg-d21pd8ripnbc73fpb5ug-a.oregon-postgres.render.com",
  database: "dbfinal_lalh",
  password: "NfwF5BxtlPbqAzW0H7HzpijL79ZBckOb",
  //   database: "todo_app", // CSDL trong pg
  //   password: "your_password", // Pass trong pg
  // database: "Cloud To-do",
  // password: "khanhanh12",

  port: 5432,
});

module.exports = pool;
