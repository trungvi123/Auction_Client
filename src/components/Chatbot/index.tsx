import React, { useState } from "react";
import userApi from "../../api/userApi";
import formatDateTime from "../../utils/formatDay";
import "./Chatbot.css";

interface IMessage {
  message: string;
  sender: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      message: "Chào bạn 👋!, rất vui khi được giải đáp thắc mắc của bạn!",
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
    if (res?.status === "success") {
      newMessage.push({
        message: res.response,
        sender: "bot",
      });
      setMessages(newMessage);
      setMessage("");
    }
    setIsTyping(false);
  };

  return (
    <div>
      <div className="chat-screen">
        <div className="chat-header">
          <div className="chat-header-title">CIT AUCTION</div>
        </div>
        <div className="chat-body">
          <div className="chat-start">
            {formatDateTime(new Date().toString())}
          </div>

          {messages.map((item, index) => {
            let mess =  item.message.replace(item?.message[0],item?.message[0]?.toLocaleUpperCase())
            if (item.sender !== "user") {
              return (
                <div key={index} className="chat-bubble you" >
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
      {isTyping && <div className="chat-bubble you">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              style={{
                margin: "auto",
                display: "block",
                shapeRendering: "auto",
                width: "43px",
                height: "20px",
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <circle cx="0" cy="44.1678" r="15" fill="#ffffff">
                <animate
                  attributeName="cy"
                  calcMode="spline"
                  keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                  repeatCount="indefinite"
                  values="57.5;42.5;57.5;57.5"
                  keyTimes="0;0.3;0.6;1"
                  dur="1s"
                  begin="-0.6s"
                ></animate>
              </circle>{" "}
              <circle cx="45" cy="43.0965" r="15" fill="#ffffff">
                <animate
                  attributeName="cy"
                  calcMode="spline"
                  keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                  repeatCount="indefinite"
                  values="57.5;42.5;57.5;57.5"
                  keyTimes="0;0.3;0.6;1"
                  dur="1s"
                  begin="-0.39999999999999997s"
                ></animate>
              </circle>{" "}
              <circle cx="90" cy="52.0442" r="15" fill="#ffffff">
                <animate
                  attributeName="cy"
                  calcMode="spline"
                  keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                  repeatCount="indefinite"
                  values="57.5;42.5;57.5;57.5"
                  keyTimes="0;0.3;0.6;1"
                  dur="1s"
                  begin="-0.19999999999999998s"
                ></animate>
              </circle>
            </svg>
          </div>}
          
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
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
      <div className="chat-bot-icon">
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
          className="feather feather-message-square animate"
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
          className="feather feather-x "
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
  );
};

export default ChatBot;
