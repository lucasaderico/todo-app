const form = document.querySelector("#form");
const input = document.querySelector("#todo");
const submitBtn = document.querySelector("#btn");
const output = document.querySelector("#output");

// Display ToDos
async function loadTodos() {
  try {
    const res = await fetch("http://localhost:8000/api/todos");
    const data = await res.json();

    output.innerHTML = "";

    for (let i = 0; i < data.length; ++i) {
      const div = document.createElement("div");
      div.classList.add("each");
      div.innerHTML = `
        <div class="num">${data[i].id}</div>
        <h3>${data[i].name}</h3>
        <div class="cta">
          <form class="update-form none update-${data[i].id}">
            <input
              type="text"
              name="update"
              placeholder="Update your ToDo"
              class="update-input"
            />
            <button type="submit" class="submit-edit">Enter</button>
          </form>
          <button id="update-todo-${data[i].id}" class="btn update">Update</button>
          <button id="delete-todo-${data[i].id}" class="btn delete">Delete</button>
        </div>
      `;
      output.appendChild(div);
    }

    if (data.length) {
      output.classList.remove("hide");
    }

    addDeleteEvent();
    addToggleEvent();
    getUpdateButtons();
  } catch (error) {
    console.log(error);
  }
}

// Add new ToDo
async function createTodo(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const name = formData.get("todo");

  try {
    const res = await fetch("http://localhost:8000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Failed to add post");
    }

    input.value = "";

    loadTodos();
  } catch (error) {
    console.log(error);
  }
}

// Delete ToDo and update screen
async function deleteTodo(e) {
  const id = parseInt(
    e.target.parentNode.parentNode.querySelector(".num").innerText,
  );

  try {
    const res = await fetch(`http://localhost:8000/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await res.json();

    loadTodos();
  } catch (error) {
    console.log(error);
  }
}

// Update ToDo and screen
async function updateTodo(e) {
  e.preventDefault();

  const id = parseInt(
    e.target.parentNode.parentNode.parentNode.querySelector(".num").innerText,
  );
  const form = e.target.parentNode;
  const input = e.target.parentNode.querySelector(".update-input");

  const formData = new FormData(form);
  const name = formData.get("update");

  try {
    const res = await fetch(`http://localhost:8000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Failed to add post");
    }

    input.value = "";

    loadTodos();
  } catch (error) {
    console.log(error);
  }
}

//
// HELPER FUNCTIONS
//

async function addDeleteEvent() {
  const delBtn = document.querySelectorAll(".delete");

  for (let i = 0; i < delBtn.length; ++i) {
    delBtn[i].addEventListener("click", deleteTodo);
  }
}

function addToggleEvent() {
  const buttons = document.querySelectorAll(".update");

  for (let i = 0; i < buttons.length; ++i) {
    const form = buttons[i].parentNode.querySelector(".none");
    buttons[i].addEventListener("click", () => {
      form.classList.toggle("none");
    });
  }
}

function getUpdateButtons() {
  const buttons = document.querySelectorAll(".submit-edit");

  for (let i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener("click", updateTodo);
  }
}

form.addEventListener("submit", createTodo);

loadTodos();
