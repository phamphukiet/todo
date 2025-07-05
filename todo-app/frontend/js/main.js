document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("taskForm").addEventListener("submit", createTask);

let editingTaskId = null;
let statusOptions = [];

async function loadStatusOptions() {
  const res = await fetch("http://localhost:3000/api/status");
  statusOptions = await res.json();
}

async function loadTasks() {
  const res = await fetch("http://localhost:3000/api/tasks");
  const tasks = await res.json();
  const tbody = document.getElementById("taskTableBody");
  tbody.innerHTML = "";
  tasks.forEach((task, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${task.title}</td>
        <td>${task.description || ""}</td>
        <td><span class="badge bg-secondary">${
          task.status || "Không xác định"
        }</span></td>
        <td>
          <button onclick='editTask(${task.id}, ${JSON.stringify(
      task.title
    )}, ${JSON.stringify(
      task.description || ""
    )})' class="btn btn-sm btn-warning me-1">Sửa</button>
          <button onclick="deleteTask(${
            task.id
          })" class="btn btn-sm btn-danger">Xoá</button>
        </td>
      </tr>
    `;
  });
}

async function createTask(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if (editingTaskId) {
    // Sửa task
    const res = await fetch(
      `http://localhost:3000/api/tasks/${editingTaskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      }
    );

    if (res.ok) {
      editingTaskId = null;
      document.querySelector("#taskForm button").innerText = "➕ Thêm Task";
      e.target.reset();
      await loadTasks(); // <<< Đảm bảo gọi lại bảng sau khi update thành công
    } else {
      alert("Không thể cập nhật task.");
    }
  } else {
    // Thêm mới task
    const res = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, title, description, status_id: 1 }),
    });

    if (res.ok) {
      e.target.reset();
      await loadTasks();
    } else {
      alert("Không thể tạo task mới.");
    }
  }
}

async function deleteTask(id) {
  await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: "DELETE",
  });
  loadTasks();
}

function editTask(id, title, description) {
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;
  editingTaskId = id;
  document.querySelector("#taskForm button").innerText = "💾 Cập nhật Task";
}

//login
document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("loginForm");
        form.addEventListener("submit", async (e) => {
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
              window.location.href = "../table/main.html"; // chuyển đúng tới file bạn có
            } else {
              document.getElementById("loginError").textContent =
                data.error || "Đăng nhập thất bại";
            }
          } catch (err) {
            document.getElementById("loginError").textContent =
              "Lỗi kết nối đến server.";
          }
        });
      });
      
//register
document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("registerForm");
        form.addEventListener("submit", async (e) => {
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
              window.location.href = "../user/login.html";
            } else {
              document.getElementById("registerError").textContent =
                data.error || "Đăng ký thất bại";
            }
          } catch (err) {
            document.getElementById("registerError").textContent =
              "Lỗi kết nối đến server.";
          }
        });
      });

//logout
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeUser = document.getElementById("welcomeUser");

  if (!token) {
    // Nếu chưa đăng nhập → chuyển về login
    window.location.href = "../user/login.html";
    return;
  }

  // ✅ Giải mã token để lấy tên người dùng
  const payload = JSON.parse(atob(token.split('.')[1])); // Phần giữa của JWT là payload
  const username = payload.username;

  // ✅ Hiển thị tên người dùng
  welcomeUser.textContent = `Xin chào, ${username}`;
  logoutBtn.classList.remove("d-none");

  // ✅ Gán sự kiện logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../user/login.html";
  });
});
//  code này là phần nâng cấp giao diện
// function togglePassword() { 
//   const pwd = document.getElementById("password");
//   const icon = document.querySelector(".toggle-password");
//   if (pwd.type === "password") {
//     pwd.type = "text";
//     icon.classList.remove("fa-eye");
//     icon.classList.add("fa-eye-slash");
//   } else {
//     pwd.type = "password";
//     icon.classList.remove("fa-eye-slash");
//     icon.classList.add("fa-eye");
//   }
// }

// let currentLang = "vie";
// function toggleLanguage() {
//   const slider = document.getElementById("langSlider");
//   if (currentLang === "vie") {
//     slider.style.transform = "translateX(42px)";
//     currentLang = "eng";
//     applyEnglish();
//   } else {
//     slider.style.transform = "translateX(0)";
//     currentLang = "vie";
//     applyVietnamese();
//   }
// }

// function applyEnglish() {
//   document.getElementById("siteSubtitle").innerText = "Build a To-Do List management website";
//   document.getElementById("loginTitle").innerText = "Login";
//   document.getElementById("username").placeholder = "Username";
//   document.getElementById("password").placeholder = "Password";
//   document.getElementById("loginButton").innerText = "Login";
//   document.getElementById("noAccount").innerText = "Don't have an account?";
//   document.getElementById("registerLink").innerText = "Register here";
// }

// function applyVietnamese() {
//   document.getElementById("siteSubtitle").innerText = "Xây dựng website quản lý To-Do List";
//   document.getElementById("loginTitle").innerText = "Đăng nhập";
//   document.getElementById("username").placeholder = "Tên đăng nhập";
//   document.getElementById("password").placeholder = "Mật khẩu";
//   document.getElementById("loginButton").innerText = "Đăng nhập";
//   document.getElementById("noAccount").innerText = "Bạn chưa có tài khoản?";
//   document.getElementById("registerLink").innerText = "Đăng ký tại đây";
// }
// function applyEnglish() {
//   if(document.getElementById("loginTitle")) {
//     document.getElementById("siteSubtitle").innerText = "Build a To-Do List management website";
//     document.getElementById("loginTitle").innerText = "Login";
//     document.getElementById("username").placeholder = "Username";
//     document.getElementById("password").placeholder = "Password";
//     document.getElementById("loginButton").innerText = "Login";
//     document.getElementById("noAccount").innerText = "Don't have an account?";
//     document.getElementById("registerLink").innerText = "Register here";
//   } else if(document.getElementById("registerTitle")) {
//     document.getElementById("siteSubtitle").innerText = "Build a To-Do List management website";
//     document.getElementById("registerTitle").innerText = "Register";
//     document.getElementById("username").placeholder = "Username";
//     document.getElementById("password").placeholder = "Password";
//     document.getElementById("registerButton").innerText = "Create account";
//     document.getElementById("hasAccount").innerText = "Already have an account?";
//     document.getElementById("loginLink").innerText = "Login";
//   }
// }

// function applyVietnamese() {
//   if(document.getElementById("loginTitle")) {
//     document.getElementById("siteSubtitle").innerText = "Xây dựng website quản lý To-Do List";
//     document.getElementById("loginTitle").innerText = "Đăng nhập";
//     document.getElementById("username").placeholder = "Tên đăng nhập";
//     document.getElementById("password").placeholder = "Mật khẩu";
//     document.getElementById("loginButton").innerText = "Đăng nhập";
//     document.getElementById("noAccount").innerText = "Bạn chưa có tài khoản?";
//     document.getElementById("registerLink").innerText = "Đăng ký tại đây";
//   } else if(document.getElementById("registerTitle")) {
//     document.getElementById("siteSubtitle").innerText = "Xây dựng website quản lý To-Do List";
//     document.getElementById("registerTitle").innerText = "Đăng ký";
//     document.getElementById("username").placeholder = "Tên đăng nhập";
//     document.getElementById("password").placeholder = "Mật khẩu";
//     document.getElementById("registerButton").innerText = "Tạo tài khoản";
//     document.getElementById("hasAccount").innerText = "Đã có tài khoản?";
//     document.getElementById("loginLink").innerText = "Đăng nhập";
//   }
// }