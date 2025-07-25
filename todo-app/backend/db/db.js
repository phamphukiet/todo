// Kết nối PostgreSQL
const { Pool } = require("pg");

const pool = new Pool({
  user: "ask",
  host: "dpg-d21sjv7fte5s73815pj0-a.singapore-postgres.render.com",
  database: "daily_fqqq",
  password: "rxTiUYcwrNuGbDAXFCjD9QHCCIIg4RiX",

  port: 5432,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
