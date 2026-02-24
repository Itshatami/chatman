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
  document.querySelectorAll("conversation-item").forEach((item) => {
    item.onclick = () => {
      const conversationId = item.dataset.id;
      openConversation(conversationId);
    };
  });
}

async function openConversation(conversationId) {
  const res = await api.get(`/api/messages/${conversationId}`);

  const messagesDiv = document.getElementById("messages");

  messagesDiv.innerHTML = res.data
    .map(
      (msg) =>
        `
        <div>
      <strong>${msg.sender.username}:</strong>
      ${msg.content}
    </div>
        `
    )
    .join("");
}

// search logic
document.getElementById("searchBtn").onclick = async () => {
  const value = document.getElementById("search").value;
  if (!value) return;

  const res = await api.get(`/api/search?q=${value}`);

  const sidebar = document.getElementById("sidebar");
  if (res.data.length === 0) {
    sidebar.innerHTML = "<li class='list-group-item'>No users found</li>";
    return;
  }

  sidebar.innerHTML = res.data
    .map(
      (user) => `
         <li 
      class="list-group-item list-group-item-action user-result"
      data-id="${user._id}"
      style="cursor:pointer"
    >
      ${user.username}
    </li>
    `
    )
    .join("");

  attachUserClick();
};

// when click a user open chat
function attachUserClick() {
  document.querySelectorAll("user-result").forEach((item) => {
    item.onclick = async () => {
      const otherUserId = item.dataset.id;

      // Ask server to get/create conversation
      const res = await api.post("/conversations", {
        userId: otherUserId,
      });

      openConversation(res.data._id);
    };
  });
}
