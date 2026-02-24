import { useEffect, useState } from "react";
import api from "../api";

export default function Sidebar({ onSelect }) {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadConversations = async () => {
      const res = await api.get("/conversations");
      setConversations(res.data);
    };
    loadConversations();
  }, []);

  const handleSearch = async () => {
    if (!search) return;

    const res = await api.get(`/search?q=${search}`);
    setResults(res.data);
  };

  return (
    <div className="p-3">
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

      {results.map((u) => (
        <div key={u._id} className="list-group-item list-group-item-action" onClick={() => onSelect({ userId: u._id })}>
          {u.username}
        </div>
      ))}

      <hr />

      {conversations.map((c) => {
        const otherUser = c.participants.find((p) => p._id !== user.id);

        return (
          <div key={c._id} className="list-group-item list-group-item-action" onClick={() => onSelect(c)}>
            <strong>{otherUser?.username}</strong>
            <br />
            <small className="text-muted">{c.lastMessage?.content || "No messages"}</small>
          </div>
        );
      })}
    </div>
  );
}
