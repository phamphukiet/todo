const CURRENT_USER_ID = 1;
let currentDate = new Date();
const MAX_TASK_PER_DAY = 5;

// ===== DATE UTILITIES ====== //

function getWeekRange(date) {
  const day = new Date(date);
  const dayOfWeek = day.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(day);
  monday.setDate(day.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

function getWeekNumber(date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

function formatDate(date) {
  return date.toLocaleDateString("vi-VN");
}

// ===== USER & INIT LOADING ===== //

function fetchAndShowUsername() {
  fetch(`http://localhost:3000/api/user/${CURRENT_USER_ID}`)
    .then((res) => res.json())
    .then((user) => {
      document.getElementById(
        "usernameDisplay"
      ).textContent = `Xin chào, ${user.username} 👋`;
    })
    .catch(() => {
      document.getElementById("usernameDisplay").textContent =
        "Xin chào, bạn 👋";
    });
}

// ===== WEEK NAVIGATION ====== //

function updateWeekView() {
  const weekRange = getWeekRange(currentDate);
  const weekNumber = getWeekNumber(currentDate);

  document.getElementById(
    "currentWeek"
  ).innerText = `Tuần ${weekNumber}: ${formatDate(
    weekRange.monday
  )} – ${formatDate(weekRange.sunday)}`;
  document.getElementById("datePicker").value = currentDate
    .toISOString()
    .split("T")[0];

  renderWeekColumns();
  fetchBlockTasks();
  fetchTaskSummary();
}

document.getElementById("prevWeek").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 7);
  updateWeekView();
});

document.getElementById("nextWeek").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 7);
  updateWeekView();
});

document.getElementById("datePicker").addEventListener("change", (e) => {
  currentDate = new Date(e.target.value);
  updateWeekView();
});

// ===== UI RENDERING ===== //

function renderWeekColumns() {
  const weekRange = getWeekRange(currentDate);
  const container = document.getElementById("weekView");
  container.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekRange.monday);
    day.setDate(day.getDate() + i);
    const dayStr = day.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-header text-center fw-bold bg-light">${dayStr}</div>
        <div class="card-body" id="day-${i}"></div>
      </div>
    `;
    container.appendChild(col);
  }
}

function renderTasksByDay(blockArray) {
  for (let i = 0; i < 7; i++) {
    const dayContainer = document.getElementById(`day-${i}`);
    dayContainer.innerHTML = "";

    const tasks = blockArray[i];
    tasks.forEach((task) => {
      const taskBox = document.createElement("div");
      taskBox.className = "task-box mb-2 p-2 rounded border";
      taskBox.style.backgroundColor = getStatusColor(task.status_name);
      taskBox.innerHTML = `
        <div class="fw-semibold">${task.title}</div>
        <div class="small text-muted">${formatDateDisplay(task.due_date)}</div>
        <select class="form-select form-select-sm mt-1" data-task-id="${
          task.id
        }">
          <option value="1" ${
            task.status_id == 1 ? "selected" : ""
          }>To do</option>
          <option value="2" ${
            task.status_id == 2 ? "selected" : ""
          }>Doing</option>
          <option value="3" ${
            task.status_id == 3 ? "selected" : ""
          }>Done</option>
        </select>
      `;

      const select = taskBox.querySelector("select");
      select.addEventListener("change", () => {
        const newStatus = select.value;
        const taskId = select.dataset.taskId;
        updateTaskStatus(taskId, newStatus);
      });

      dayContainer.appendChild(taskBox);
    });
  }
}

function getStatusColor(status) {
  switch (status) {
    case "To do":
      return "#f8d7da";
    case "Doing":
      return "#fff3cd";
    case "Done":
      return "#d1e7dd";
    default:
      return "#f0f0f0";
  }
}

// ===== FETCH API CALLS ===== //

function fetchBlockTasks() {
  const weekNumber = getWeekNumber(currentDate);
  console.log("📦 Tải lại block data sau cập nhật...");
  fetch(`http://localhost:3000/api/block/${CURRENT_USER_ID}?week=${weekNumber}`)
    .then((res) => res.json())
    .then((data) => {
      renderTasksByDay(data.tasks);
    })
    .catch((err) => console.error("❌ Lỗi khi fetch block:", err));
}

function fetchTaskSummary() {
  const weekNumber = getWeekNumber(currentDate);
  fetch(
    `http://localhost:3000/api/block/summary/${CURRENT_USER_ID}?week=${weekNumber}`
  )
    .then((res) => res.json())
    .then((data) => {
      applyOverloadWarning(data.summary);
    });
}

function applyOverloadWarning(summary) {
  const weekRange = getWeekRange(currentDate);
  Object.keys(summary).forEach((dateStr) => {
    const count = summary[dateStr];
    const dayDate = new Date(dateStr);
    const diff = Math.floor(
      (dayDate - weekRange.monday) / (1000 * 60 * 60 * 24)
    );
    if (diff < 0 || diff > 6) return;
    const card = document.getElementById(`day-${diff}`).parentElement;
    if (count > MAX_TASK_PER_DAY) {
      card.classList.add("border-danger");
    } else {
      card.classList.remove("border-danger");
    }
  });
}

// ===== TASK STATUS UPDATE ===== //

function updateTaskStatus(taskId, newStatusId) {
  const url = `http://localhost:3000/api/task/${taskId}/status`;
  const payload = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status_id: parseInt(newStatusId) }),
  };

  console.log(url, payload);

  fetch(url, payload)
    .then((res) => {
      console.log("📥 Response từ PUT:", res.status, res.statusText);
      if (!res.ok) throw new Error("Lỗi cập nhật trạng thái");
      return res.json();
    })
    .then(() => {
      updateWeekView();
    })
    .catch((err) => {
      console.error("❌ Lỗi cập nhật task:", err);
    });
}

// ===== INIT ===== //

fetchAndShowUsername();
updateWeekView();
