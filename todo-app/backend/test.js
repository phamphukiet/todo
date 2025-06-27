const {
  createTask,
  getAllTasks,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
} = require("./controllers/taskController");
const fn = getTasksByUser;

const req = {
  //   body: {
  //     title: "Đọc tài liệu",
  //     description: "Đọc hướng dẫn dự án",
  //     due_date: "2023-10-31",
  //   },
  params: { user_id: "2" }, // Thay đổi ID theo nhu cầu
  query: {},
};

const res = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log(`✅ Status: ${this.statusCode}`);
    console.log("📦 Response:", data);
  },
};

(async () => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("❌ Lỗi khi test:", err.message);
  }
})();
