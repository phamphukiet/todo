const db = require("../db");

exports.getAllTasks = async (req, res) => {
  const result = await db.query("SELECT * FROM tasks ORDER BY id");
  res.json(result.rows);
};

exports.createTask = async (req, res) => {
  const { user_id, title, description, status_id } = req.body;
  await db.query(
    "INSERT INTO tasks (user_id, title, description, status_id) VALUES ($1, $2, $3, $4)",
    [user_id, title, description, status_id]
  );
  res.status(201).json({ message: "Task created" });
};

exports.deleteTask = async (req, res) => {
  const id = req.params.id;
  await db.query("DELETE FROM tasks WHERE id = $1", [id]);
  res.status(204).send();
};

// exports.updateTask = async (req, res) => {
//   const id = req.params.id;
//   const { title, description } = req.body;
//   if (!title || !description) {
//     return res
//       .status(400)
//       .json({ error: "Title and description are required" });
//   }
//   await db.query(
//     "UPDATE tasks SET title = $1, description = $2 WHERE id = $3",
//     [title, description, id]
//   );

//   res.json({ message: "Task updated" });
// };

exports.updateTask = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  console.log("🔧 UPDATE TASK CALLED");
  console.log("🧾 ID:", id);
  console.log("📝 Title:", title);
  console.log("📝 Description:", description);

  try {
    const result = await db.query(
      "UPDATE tasks SET title = $1, description = $2 WHERE id = $3",
      [title, description, id]
    );

    console.log("✅ Cập nhật thành công:", result.rowCount);
    res.json({ message: "Task updated" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật:", err.message);
    res.status(500).json({ error: "Lỗi khi cập nhật task" });
  }
};
