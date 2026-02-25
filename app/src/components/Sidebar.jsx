import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ onSelect }) {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const { user, token } = useAuth();

  // 🔹 Load conversations when token exists
  useEffect(() => {
    if (!token) return;

    const loadConversations = async () => {
      try {
        const res = await api.get("/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConversations(res.data.conversations);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };

    loadConversations();
  }, [token]);

  // 🔹 Search user
  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await api.get(`/search?username=${search}`, { headers: { Authorization: `Bearer ${token}` } });
      console.log("searched user-> ", res.data.user);

      if (res.data.user) {
        setResult(res.data.user);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
    } catch (err) {
      setResult(null);
      setNotFound(true);
      console.log(err.message);
    }
  };

  const handleSelectUser = async (selectedUser) => {
    try {
      const res = await api.post(
        "/conversations",
        { otherUserId: selectedUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const conversation = res.data.conversation || res.data;

      // Open chat
      onSelect(conversation);

      // Clear search UI
      setResult(null);
      setSearch("");
      setNotFound(false);

      // Add to sidebar if not already there
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === conversation._id);
        return exists ? prev : [conversation, ...prev];
      });
    } catch (err) {
      console.error("Failed to create/open conversation", err);
    }
  };

  return (
    <div className="p-3">
      {/* 🔍 Search Section */}
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* 🔹 Search Result */}
      {result && (
        <div
          key={result._id}
          className="list-group-item list-group-item-action"
          onClick={() => {
            handleSelectUser(result)
            setResult(null);
            setSearch("");
          }}
        >
          {result.username}
        </div>
      )}

      {notFound && <div className="text-muted small mb-2">User not found</div>}

      <hr />

      {/* 💬 Conversations Section */}
      {conversations.length === 0 ? (
        <div className="text-muted small">No conversations yet</div>
      ) : (
        conversations.map((c) => {
          const otherUser = c.participants.find((p) => p._id !== user.id);

          return (
            <div key={c._id} className="list-group-item list-group-item-action" onClick={() => onSelect(c)}>
              <strong>{otherUser?.username}</strong>
              <br />
              <small className="text-muted">{c.lastMessage?.content || "No messages"}</small>
            </div>
          );
        })
      )}
    </div>
  );
}
