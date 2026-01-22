import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeft, MessageCircleCode, Send } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [showChat, setShowChat] = useState(false); // 📱 mobile toggle

  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const API = import.meta.env.VITE_API_URL;

  const sendMessageHandler = async () => {
    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(
        `${API}/message/send/${selectedUser?._id}`,
        { textMessage },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* ================= USER LIST ================= */}
      <section
        className={`w-full md:w-[320px] border-r bg-white
        ${showChat ? "hidden md:block" : "block"}`}
      >
        <h1 className="font-bold px-4 py-4 text-xl border-b">
          {user?.username}
        </h1>

        <div className="overflow-y-auto h-[calc(100vh-70px)]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => {
                  dispatch(setSelectedUser(suggestedUser));
                  setShowChat(true);
                }}
                className="flex gap-3 items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-medium">
                    {suggestedUser?.username}
                  </span>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CHAT SECTION ================= */}
      <section
        className={`flex-1 flex flex-col
        ${showChat ? "block" : "hidden md:flex"}`}
      >
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
              {/* Mobile Back */}
              <button
                className="md:hidden"
                onClick={() => setShowChat(false)}
              >
                <ArrowLeft />
              </button>

              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <span className="font-medium">
                {selectedUser?.username}
              </span>
            </div>

            {/* Messages */}
            <Messages selectedUser={selectedUser} />

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t bg-white">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                placeholder="Message..."
                className="flex-1 focus-visible:ring-transparent"
                onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
              />
              <Button
                onClick={sendMessageHandler}
                disabled={!textMessage.trim()}
                size="icon"
              >
                <Send size={18} />
              </Button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircleCode className="w-24 h-24 mb-4 text-gray-400" />
            <h1 className="font-medium text-lg">Your messages</h1>
            <p className="text-gray-500">
              Send a message to start a chat.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
