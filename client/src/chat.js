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
    const res = await api.get("/conversations");
    console.log(res);

    const sidebar = document.getElementById("sidebar");

    if (res.data.conversations.length === 0) {
      sidebar.innerHTML = "<li class='list-group-item'>No conversations yet</li>";
    } else {
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
  }
  loadConversation();
  attachConversationClick();

  // search logic
  document.getElementById("searchBtn").onclick = async () => {
    const value = document.getElementById("search").value;
    if (!value) return "";

    const res = await api.get(`/search?username=${value}`);

    const sidebar = document.getElementById("sidebar");
    if (res.data.length === 0) {
      sidebar.innerHTML = "<li class='list-group-item'>No users found</li>";
      return;
    }

    sidebar.innerHTML = `
         <li 
      class="list-group-item list-group-item-action user-result"
      data-id="${res.data.user._id}"
      style="cursor:pointer"
    >
      ${res.data.user.username}
    </li>
    `;

    attachUserClick();
  };
}

function attachConversationClick() {
  document.querySelector(".conversation-item").forEach((item) => {
    item.onclick = () => {
      const conversationId = item.dataset.id;
      console.log("conversationId", conversationId);

      openConversation(conversationId);
    };
  });
}

async function openConversation(conversationId) {
  console.log("conversationId-> ", conversationId);
  
  const res = await api.get(`/messages/${conversationId}`);
  console.log(res.data);
  
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

// when click a user open chat
function attachUserClick() {
  document.querySelector(".user-result").onclick = async () => {
    const otherUserId = document.querySelector(".user-result").dataset.id;
    console.log("other user id-> ", otherUserId);

    // Ask server to get/create conversation
    const res = await api.post("/conversations", {
      otherUserId,
    });

    console.log(res.data);

    openConversation(res.data.id);
  };
}
