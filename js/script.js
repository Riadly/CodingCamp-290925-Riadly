let todos = [];
let currentFilter = "all";

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const filterSelect = document.getElementById("filterSelect");
const deleteAllBtn = document.getElementById("deleteAllBtn");

// Set minimum date to today
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// Form submit event
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

// Filter select event
filterSelect.addEventListener("change", function () {
  currentFilter = this.value;
  renderTodos();
});

// Delete all button event
deleteAllBtn.addEventListener("click", function () {
  if (todos.length === 0) {
    alert("No tasks to delete!");
    return;
  }

  if (
    confirm(
      "Are you sure you want to delete all tasks? This action cannot be undone."
    )
  ) {
    todos = [];
    renderTodos();
  }
});

// Add todo function
function addTodo() {
  const task = todoInput.value.trim();
  const date = dateInput.value;

  if (task && date) {
    const todo = {
      id: Date.now(),
      task: task,
      date: date,
      completed: false,
    };

    todos.push(todo);
    todoInput.value = "";
    dateInput.value = "";
    renderTodos();
  }
}

// Delete todo function
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

// Get date status
function getDateStatus(dateString) {
  const todoDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  todoDate.setHours(0, 0, 0, 0);

  if (todoDate < today) return "overdue";
  if (todoDate.getTime() === today.getTime()) return "today";
  return "upcoming";
}

// Filter todos based on current filter
function filterTodos() {
  if (currentFilter === "all") return todos;
  return todos.filter((todo) => getDateStatus(todo.date) === currentFilter);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Render todos
function renderTodos() {
  const filteredTodos = filterTodos();

  if (filteredTodos.length === 0) {
    todoList.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  todoList.innerHTML = filteredTodos
    .map((todo) => {
      const status = getDateStatus(todo.date);
      let bgColor = "bg-blue-50 border-blue-200";
      let statusBadge = "bg-blue-100 text-blue-800";
      let statusText = "Upcoming";

      if (status === "today") {
        bgColor = "bg-green-50 border-green-200";
        statusBadge = "bg-green-100 text-green-800";
        statusText = "Today";
      } else if (status === "overdue") {
        bgColor = "bg-red-50 border-red-200";
        statusBadge = "bg-red-100 text-red-800";
        statusText = "Overdue";
      }

      return `
                    <div class="border-2 ${bgColor} rounded-lg p-4 hover:shadow-md transition duration-200">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">${
                                  todo.task
                                }</h3>
                                <div class="flex items-center gap-3 flex-wrap">
                                    <span class="text-sm text-gray-600">
                                        📅 ${formatDate(todo.date)}
                                    </span>
                                    <span class="text-xs font-semibold px-3 py-1 rounded-full ${statusBadge}">
                                        ${statusText}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onclick="deleteTodo(${todo.id})" 
                                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-sm hover:shadow-md"
                                title="Delete Task"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                `;
    })
    .join("");
}

// Initial render
renderTodos();
