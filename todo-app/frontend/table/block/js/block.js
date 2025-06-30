const CURRENT_USER_ID = 1;
let currentDate = new Date();

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

document.getElementById("btnCreateTask").addEventListener("click", () => {
  showCreateTaskForm();
});

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

fetchAndShowUsername();
updateWeekView();
