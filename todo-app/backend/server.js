const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/tasks", require("./routes/tasks"));

// Serve frontend tĩnh
const path = require("path");
app.use("/", express.static(path.join(__dirname, "../frontend")));

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
