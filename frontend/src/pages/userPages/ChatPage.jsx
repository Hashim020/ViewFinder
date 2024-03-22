import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import MyChats from "../../components/userComponents/MyChats.jsx";
import Chatbox from "../../components/userComponents/ChatBox.jsx";
import { ChatState } from "../../context/ChatProvide.jsx";
import SideBar from '../../components/userComponents/SideBar';

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  let { user } = ChatState();



  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-200">
        <SideBar />
      </div>

      <div className="ml-[10px]">
        <Box className="flex justify-between w-full h-full p-4">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </div>
  );
};

export default Chatpage;