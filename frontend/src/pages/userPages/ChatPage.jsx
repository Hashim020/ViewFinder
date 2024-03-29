import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import MyChats from "../../components/userComponents/MyChats.jsx";
import Chatbox from "../../components/userComponents/ChatBox.jsx";
import SideBar from '../../components/userComponents/SideBar';
import Aos from 'aos'
import '../../../node_modules/aos/dist/aos.css'
import { ChatState } from "../../context/ChatProvide.jsx";
const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  let { user,setUser } = ChatState();
  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {}
    Aos.init();
    setFetchAgain(true)
  },[])

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-200">
        <SideBar />
      </div>
      <div className="ml-[10px]" >
        <Box  className="flex justify-between w-full h-full p-4">
          {user && <MyChats />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </div>
  );
};

export default Chatpage;