// /backend/routes/googleAuth.js
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
const pool = require("../db/index.js"); // đổi nếu file bạn đặt pool khác
console.log("POOL:", pool);

const router = express.Router();

// Thay thế toàn bộ .env bằng hằng số ở đây
// 
// const EMAIL_USER = "youremail@gmail.com";
// const EMAIL_PASS = "rnozfifiofjohzeq";

// Khai báo Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true,
},
async (req,accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [email]);
    if (result.rows.length === 0) {
      const hash = await bcrypt.hash(Math.random().toString(36), 10);
      await pool.query("INSERT INTO users(username, password_hash) VALUES($1, $2)", [email, hash]);
      
      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: { user: EMAIL_USER, pass: EMAIL_PASS }
      // });
      // await transporter.sendMail({
      //   from: '"My ToDo App" <no-reply@mytodo.com>',
      //   to: email,
      //   subject: "Đăng ký thành công",
      //   text: "Bạn đã đăng ký thành công bằng Google. Chúc bạn sử dụng vui vẻ!"
      // });
    }
    done(null, { email });
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Route đăng nhập Google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route callback Google
router.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/user/login.html" }),
  (req, res) => {
    res.redirect(`/index.html?username=${req.user.email}`);

  }
);

module.exports = router;
