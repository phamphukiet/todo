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

function fetchBlockTasks() {
  const weekNumber = getWeekNumber(currentDate);
  console.log("📦 Tải lại block data sau cập nhật...");
  fetch(`http://localhost:3000/api/block/${CURRENT_USER_ID}?week=${weekNumber}`)
    .then((res) => res.json())
    .then(async (data) => {
      const res = await fetch("http://localhost:3000/api/status");
      const allStatuses = await res.json();
      renderTasksByDay(data.tasks, allStatuses);
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
