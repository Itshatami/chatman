import api from "./api.js";

export function renderChat(container) {
  container.innerHTML = `
      <div class="container-fluid">
    <div class="row vh-100">

      <div class="col-4 border-end p-3">

        <div class="input-group mb-3">
          <input id="search" class="form-control" placeholder="Search user..." />
          <button id="searchBtn" class="btn btn-primary">
            Search
          </button>
        </div>

        <ul id="sidebar" class="list-group"></ul>

      </div>

      <div class="col-8 p-3">
        <div id="messages"></div>
      </div>

    </div>
  </div>
    `;

  async function loadConversation() {
    const res = await api.get("/api/convesations");

    const sidebar = document.getElementById("sidebar");

    if (res.data.length === 0) {
      sidebar.innerHTML = "<li class='list-group-item'>No conversations yet</li>";
    }

    sidebar.innerHTML = res.data
      .map((conv) => {
        const otherUser = conv.participants.find((p) => p._id !== JSON.parse(localStorage.getItem("user")).id);
        const lastMessage = conv.lastMessage?.content;

        return `
      <li 
        class="list-group-item list-group-item-action conversation-item"
        data-id="${conv._id}"
        style="cursor:pointer"
      >
        <strong>${otherUser.username}</strong>
        <br/>
        <small class="text-muted">${lastMessage}</small>
      </li>
    `;
      })
      .join("");
  }
  attachConversationClick();
}

function attachConversationClick() {
    
}