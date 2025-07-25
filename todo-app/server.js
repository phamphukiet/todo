const express = require("express");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const pool = require("./backend/db/db"); // Kết nối CSDL
require("./backend/db/db"); // Khởi tạo CSDL nếu chưa có
require("./backend/db/init_db");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(passport.initialize());
//app.use(passport.session());
const googleAuthRoutes = require("./backend/routes/googleAuth");
app.use(googleAuthRoutes);

const frontendPath = path.join(__dirname, "./frontend");
console.log("Serving static files from:", frontendPath);
app.use(express.static(frontendPath));

app.use(session({
  secret: process.env.SESSION_SECRET || "sunce",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ⚠️ để true nếu dùng HTTPS trên production
    maxAge: 24 * 60 * 60 * 1000 // 1 ngày
  }
}));

// Ghi log request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Tự động load tất cả file trong routes/
const routesPath = path.join(__dirname, "./backend/routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const routeName = file.replace(".js", "");
    const routePath = `/api/${routeName}`;
    try {
      const routeModule = require(`./backend/routes/${file}`);
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
