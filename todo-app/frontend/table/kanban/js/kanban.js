const CURRENT_USER_ID = 1;
let editingTaskId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadKanbanData();

  const today = new Date().toISOString().split("T")[0];
  const dueDateField = document.getElementById("taskDueDate");
  if (dueDateField) dueDateField.value = today;

  const btn = document.getElementById("btnToggleForm");
  if (btn) {
    btn.addEventListener("click", () => {
      showCreateTaskForm();
    });
  }
});
