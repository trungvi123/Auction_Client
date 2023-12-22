import React, { useRef, useState } from "react";
import userApi from "../../api/userApi";
import formatDateTime from "../../utils/formatDay";
import "./Chatbot.css";

interface IMessage {
  message: string;
  sender: string;
}

const ChatBot = () => {
  // ui
  const [iconActive, setIconActive] = useState<boolean>(false);

  // handle
  const [messages, setMessages] = useState<IMessage[]>([
    {
      message: "Chào bạn 👋, rất vui khi được giải đáp thắc mắc của bạn!",
      sender: "bot",
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleChat = async () => {
    const payload = {
      message: message,
    };

    let newMessage = [
      ...messages,
      {
        message: message,
        sender: "user",
      },
    ];

    setMessages(newMessage);
    setIsTyping(true);
    const res: any = await userApi.chat(payload);
    setTimeout(() => {
      if (res?.status === "success") {
        newMessage.push({
          message: res.response,
          sender: "bot",
        });
        setMessages(newMessage);
        setMessage("");
      }
      setIsTyping(false);
    }, 1000);
  };

  function handleOpenChatBot() {
    setIconActive(!iconActive);
  }

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      // Xử lý khi nhấn nút Enter
      handleChat();
    }
  };

  return (
    <div>
      <div className={`chat-screen ${iconActive ? "show-chat" : ""}`}>
        <div className="chat-header">
          <div className="chat-header-title">CIT AUCTION</div>
        </div>
        <div className="chat-body">
          <div className="chat-start">
            {formatDateTime(new Date().toString())}
          </div>

          {messages.map((item, index) => {
            let mess = item.message.replace(
              item?.message[0],
              item?.message[0]?.toLocaleUpperCase()
            );
            if (item.sender !== "user") {
              return (
                <div key={index} className="chat-bubble you">
                  {mess}
                </div>
              );
            } else {
              return (
                <div key={index} className="chat-bubble me">
                  {mess}
                </div>
              );
            }
          })}
          {isTyping && (
            <div className="chat-bubble you" style={{ minWidth: "70px" }}>
              <span className="loader"></span>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi..."
          />
          <div onClick={handleChat} className="input-action-icon">
            <div className="sendchat-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-send"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-bot-icon" onClick={handleOpenChatBot}>
        {/* <img src="img/we-are-here.svg" alt="we are here" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`feather feather-message-square ${
            iconActive ? "" : "animate"
          }  `}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`feather feather-x ${iconActive ? "animate" : ""}`}
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
  );
};

export default ChatBot;
