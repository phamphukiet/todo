const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

// Ghi log request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Tự động load tất cả file trong routes/
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const routeName = file.replace(".js", ""); // ví dụ: user → 'user'
    const routePath = `/api/${routeName}`; // → '/api/user'
    const routeModule = require(`./routes/${file}`);
    app.use(routePath, routeModule);
    console.log(`✅ Route loaded: ${routePath}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
