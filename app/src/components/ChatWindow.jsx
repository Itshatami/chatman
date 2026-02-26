import { useEffect, useState, useRef } from "react";
import { getSocket } from "../socket";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const { token, user } = useAuth();
  const socket = getSocket();

  const currentRoom = useRef(null);

  // 🔹 Load messages + handle room switching
  useEffect(() => {
    if (!conversation?._id) return;

    const loadMessages = async () => {
      const res = await api.get(`/messages/${conversation._id}`, { headers: { Authorization: `Bearer ${token}` } });
      console.log("load message-> " ,res.data );
      
      setMessages(res.data);
    };

    loadMessages();

    if (currentRoom.current) {
      socket.emit("leave_conversation", currentRoom.current);
    }

    socket.emit("join_conversation", conversation._id);
    currentRoom.current = conversation._id;
  }, [conversation, token]);

  // 🔹 Listen for new messages
  useEffect(() => {
    socket.on("new_message", (message) => {
      if (message.conversation === conversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [conversation]);

  // 🔹 Send Message
  const sendMessage = async () => {
    if (!text.trim()) return;

    // Send via socket (real-time)
    socket.emit("send_message", {
      conversationId: conversation._id,
      content: text,
    });

    setText("");
  };

  if (!conversation) {
    return <div className="p-3">Select a conversation</div>;
  }

  return (
    <div className="d-flex flex-column vh-100">
      {/* 🔹 Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((m) => (
          <div key={m._id} className="mb-2">
            <strong>{m.sender === user.id ? "You" : "User"}:</strong> {m.content}
          </div>
        ))}
      </div>

      {/* 🔹 Input */}
      <div className="border-top p-3 d-flex gap-2">
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
