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
    <div ref={scrollRef} style={{ height: "510px", marginTop:"10px" , overflowY: "auto" }}>
        {messages &&
          messages.map((m, i) => (
            <div
              style={{
                display: "flex",
                justifyContent: m.sender._id === user._id ? "flex-end" : "flex-start",
              }}
              key={m._id}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.profileImageName}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i,user._id) ? 0 : 10,
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
    </div>
  );
};

export default ScrollableChat;