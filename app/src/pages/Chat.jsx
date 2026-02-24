import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const [activeConversation, setActiveConversation] = useState(null);

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <div className="col-4 border-end">
          <Sidebar onSelect={setActiveConversation} />
        </div>
        <div className="col-8">
          <ChatWindow conversation={activeConversation} />
        </div>
      </div>
    </div>
  );
}