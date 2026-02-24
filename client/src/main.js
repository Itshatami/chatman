import "./api.js";
import { renderChat } from "./chat.js";
import { renderLogin } from "./auth.js";

const app = document.getElementById("app");

function router() {
  const hash = window.location.hash;

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.hash = "#/login";
  }

  if (hash === "#/chat") {
    renderChat(app);
  } else {
    renderLogin(app);
  }
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
