import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const {token } = useAuth() 

  useEffect(() => {
    if (!conversation?._id) return;

    const loadMessages = async () => {
      const res = await api.get(`/messages/${conversation._id}` , {headers:{Authorization:`Bearer ${token}`}});
      setMessages(res.data);
    };
    loadMessages();
  }, [conversation]);

  if (!conversation) {
    return <div className="p-3">Select a conversation</div>;
  }

  return (
    <div className="p-3">
      {messages.map((m) => (
        <div key={m._id}>
          <strong>{m.sender.username}:</strong> {m.content}
        </div>
      ))}
    </div>
  );
}
