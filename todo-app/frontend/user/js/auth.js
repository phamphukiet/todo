document.addEventListener("DOMContentLoaded", () => {
  // LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "../../index.html";
        } else {
          const errorMsg = data?.error || "Đăng nhập thất bại";
          document.getElementById("loginError").textContent = errorMsg;
        }
      } catch (err) {
        if (err instanceof TypeError) {
          // Lỗi mạng thực sự (VD: server không chạy)
          document.getElementById("loginError").textContent =
            "Không thể kết nối đến server.";
        } else {
          // Các lỗi khác (có thể JSON lỗi từ backend)
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
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          window.location.href = "../login.html";
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
