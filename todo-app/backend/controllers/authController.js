const pool = require("../db");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, created_at FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getUserById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       "SELECT id, username, created_at FROM users WHERE id = $1",
//       [id]
//     );
//     if (result.rows.length === 0)
//       return res.status(404).json({ error: "User not found" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "UPDATE users SET username = $1, password_hash = $2 WHERE id = $3 RETURNING *",
      [username, password_hash, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
