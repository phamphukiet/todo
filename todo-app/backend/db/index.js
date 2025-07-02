// Kết nối PostgreSQL
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  // Sang
  // database: "todoapp",
  // password: "123456",

  // Kiet
  database: "todoapp",
  password: "12345",
  port: 5432,
});

module.exports = pool;
