// --- TỰ ĐỘNG SET LOCALSTORAGE SAU ĐĂNG NHẬP GOOGLE ---
const urlParams = new URLSearchParams(window.location.search);
const usernameFromUrl = urlParams.get("username");
if (usernameFromUrl) {
  localStorage.setItem("username", usernameFromUrl);
  // Xoá query param để đẹp URL, tránh reload lại chạy tiếp
  window.history.replaceState({}, document.title, "/index.html");
}

document.addEventListener("DOMContentLoaded", () => {
  // LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("https://todo-b0us.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        console.log("Login response:", data);

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("user_id", data.user_id);
          window.location.href = "../../index.html";
        } else {
          const errorMsg = data?.error || "Đăng nhập thất bại";
          document.getElementById("loginError").textContent = errorMsg;
        }
      } catch (err) {
        if (err instanceof TypeError) {
          document.getElementById("loginError").textContent =
            "Không thể kết nối đến server.";
        } else {
          document.getElementById("loginError").textContent =
            err.message || "Đã xảy ra lỗi.";
        }
      }
    });
  }

  // REGISTER
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("https://todo-b0us.onrender.com/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("user_id", data.user_id);
          window.location.href = "../../index.html";
        } else {
          document.getElementById("registerError").textContent =
            data.error || "Đăng ký thất bại";
        }
      } catch (err) {
        document.getElementById("registerError").textContent =
          "Lỗi kết nối đến server.";
      }
    });
  }

  // LOGOUT
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "../login.html";
    });
  }
});
//  code này là phần nâng cấp giao diện
function togglePassword() {
  const pwd = document.getElementById("password");
  const icon = document.querySelector(".toggle-password");
  if (pwd.type === "password") {
    pwd.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    pwd.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

let currentLang = "vie";
function toggleLanguage() {
  const slider = document.getElementById("langSlider");
  if (currentLang === "vie") {
    slider.style.transform = "translateX(28px)";
    currentLang = "eng";
    applyEnglish();
  } else {
    slider.style.transform = "translateX(0)";
    currentLang = "vie";
    applyVietnamese();
  }
}

function applyEnglish() {
  document.getElementById("siteSubtitle").innerText = "Build a To-Do List management website";
  document.getElementById("loginTitle").innerText = "Login";
  document.getElementById("username").placeholder = "Username";
  document.getElementById("password").placeholder = "Password";
  document.getElementById("loginButton").innerText = "Login";
  document.getElementById("noAccount").innerText = "Don't have an account?";
  document.getElementById("registerLink").innerText = "Register here";
}

function applyVietnamese() {
  document.getElementById("siteSubtitle").innerText = "Xây dựng website quản lý To-Do List";
  document.getElementById("loginTitle").innerText = "Đăng nhập";
  document.getElementById("username").placeholder = "Tên đăng nhập";
  document.getElementById("password").placeholder = "Mật khẩu";
  document.getElementById("loginButton").innerText = "Đăng nhập";
  document.getElementById("noAccount").innerText = "Bạn chưa có tài khoản?";
  document.getElementById("registerLink").innerText = "Đăng ký tại đây";
}
function applyEnglish() {
  if (document.getElementById("loginTitle")) {
    document.getElementById("siteSubtitle").innerText = "Build a To-Do List management website";
    document.getElementById("loginTitle").innerText = "Login";
    document.getElementById("username").placeholder = "Username";
    document.getElementById("password").placeholder = "Password";
    document.getElementById("loginButton").innerText = "Login";
    document.getElementById("noAccount").innerText = "Don't have an account?";
    document.getElementById("registerLink").innerText = "Register here";
  } else if (document.getElementById("registerTitle")) {
    document.getElementById("siteSubtitle").innerText = "Build a To-Do List management website";
    document.getElementById("registerTitle").innerText = "Register";
    document.getElementById("username").placeholder = "Username";
    document.getElementById("password").placeholder = "Password";
    document.getElementById("registerButton").innerText = "Create account";
    document.getElementById("hasAccount").innerText = "Already have an account?";
    document.getElementById("loginLink").innerText = "Login";
  }
}

function applyVietnamese() {
  if (document.getElementById("loginTitle")) {
    document.getElementById("siteSubtitle").innerText = "Xây dựng website quản lý To-Do List";
    document.getElementById("loginTitle").innerText = "Đăng nhập";
    document.getElementById("username").placeholder = "Tên đăng nhập";
    document.getElementById("password").placeholder = "Mật khẩu";
    document.getElementById("loginButton").innerText = "Đăng nhập";
    document.getElementById("noAccount").innerText = "Bạn chưa có tài khoản?";
    document.getElementById("registerLink").innerText = "Đăng ký tại đây";
  } else if (document.getElementById("registerTitle")) {
    document.getElementById("siteSubtitle").innerText = "Xây dựng website quản lý To-Do List";
    document.getElementById("registerTitle").innerText = "Đăng ký";
    document.getElementById("username").placeholder = "Tên đăng nhập";
    document.getElementById("password").placeholder = "Mật khẩu";
    document.getElementById("registerButton").innerText = "Tạo tài khoản";
    document.getElementById("hasAccount").innerText = "Đã có tài khoản?";
    document.getElementById("loginLink").innerText = "Đăng nhập";
  }
}