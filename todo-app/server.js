const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("./backend/db/index");
require("./backend/db/index");
require("dotenv").config();

//2 dòng lệnh sử dụng cho googleAuth.js
const session = require("express-session");
const passport = require("passport");

const app = express();
app.use(express.json());

// --- TỰ ĐỘNG SET LOCALSTORAGE SAU ĐĂNG NHẬP GOOGLE ---
const urlParams = new URLSearchParams(window.location.search);
const usernameFromUrl = urlParams.get("username");
if (usernameFromUrl) {
  localStorage.setItem("username", usernameFromUrl);
  // Xoá query param để đẹp URL, tránh reload lại chạy tiếp
  window.history.replaceState({}, document.title, "/index.html");
}

const frontendPath = path.join(__dirname, "../frontend");
console.log("Serving static files from:", frontendPath);
app.use(express.static(frontendPath));

// Ghi log request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Tự động load tất cả file trong routes/
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const routeName = file.replace(".js", "");
    const routePath = `/api/${routeName}`;
    try {
      const routeModule = require(`./routes/${file}`);
      if (typeof routeModule !== "function") {
        throw new Error(`Không export ra router từ ${file}`);
      }
      app.use(routePath, routeModule);
      console.log(`✅ Route loaded: ${routePath}`);
    } catch (err) {
      console.error(`❌ Route ${file} lỗi: ${err.message}`);
    }

    console.log(`✅ Route loaded: ${routePath}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
