// const {
//   getTaskBlockByWeek,
//   getSummaryByWeek,
// } = require("./controllers/blockController");

// const { updateTaskStatus } = require("./controllers/taskController");

// const { getKanbanData } = require("./controllers/kanbanController");

const { loginUser, registerUser } = require("./controllers/authController");

const fn = loginUser;

const req = {
  body: { username: "sunce", password: "1811" },
  // params: { user_id: "1" },
  // query: { status_id: 1 },
};

const res = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log(`✅ Status: ${this.statusCode}`);
    console.log("📦 Response:", JSON.stringify(data, null, 2));
  },
};

(async () => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("❌ Lỗi khi test:", err.message);
  }
})();
