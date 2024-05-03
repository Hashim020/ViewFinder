import React, { useRef } from 'react';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics1";
import { ChatState } from "../../context/ChatProvide";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const scrollRef = useRef();

  React.useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
    ref={scrollRef}
    style={{
      height: "510px",
      marginTop: "10px",
      overflowY: "auto",
    }}
  >
    {messages &&
      messages.map((message, index) => (
        <div
          key={message._id}
          style={{
            display: "flex",
            justifyContent: message.sender._id === user._id ? "flex-end" : "flex-start",
          }}
        >
          {(isSameSender(messages, message, index, user._id) ||
            isLastMessage(messages, index, user._id)) && (
            <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={message.sender.name}
                src={message.sender.profileImageName}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${
                message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              marginLeft: isSameSenderMargin(messages, message, index, user._id) ? 0 : 10,
              marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
          >
            {message.content}
          </span>
        </div>
      ))}
  </div>
  );
};

export default ScrollableChat;