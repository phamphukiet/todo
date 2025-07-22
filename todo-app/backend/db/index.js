// Kết nối PostgreSQL
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todoapp",
  password: "123456",
  //   database: "todo_app", // CSDL trong pg
  //   password: "your_password", // Pass trong pg
  // database: "Cloud To-do",
  // password: "khanhanh12",

  port: 5432,
});

module.exports = pool;
