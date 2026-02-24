import api from "./api.js";

export function renderLogin(container) {
  container.innerHTML = `
    <div class="container mt-5" style="max-width:400px">
      <div class="card p-4">
        <h4 class="mb-3">Login / Register</h4>

        <input id="username" class="form-control mb-2" placeholder="Username" />
        <input id="password" type="password" class="form-control mb-2" placeholder="Password" />

        <button id="btn" class="btn btn-primary w-100">
          Continue
        </button>
      </div>
    </div>`;

  document.getElementById("btn").onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;    

    const res = await api.post("/auth", { username, password });
    console.log(res);
    

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    if (!localStorage.getItem("token")) window.location.hash = "#/login";

    window.location.hash = "#/chat";
  };
}
