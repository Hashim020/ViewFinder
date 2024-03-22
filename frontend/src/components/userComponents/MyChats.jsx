import { Box, Input, Stack, useToast, Text, useDisclosure } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { ChatState } from '../../context/ChatProvide';
import { getSenderName } from '../../config/ChatLogics';
import { IoCreate } from "react-icons/io5";
import GroupChatModal from '../modal/userModal/GroupChatModal';

const MyChats = (fetchAgain) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
  const [Search, setSearch] = useState(null);
  const [searchResult, setsearchResult] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [LoadingChat, setLoadingChat] = useState(false);
  const [error, seterror] = useState(null);
  const [loggedUser, setLoggedUser] = useState(user);
  const { isOpen, onOpen, onClose } = useDisclosure()





  const toast = useToast()

  const handleSearch = async (e) => {
    const { value } = e.target;
    setSearch(value);
    if (!value.trim()) {
      setsearchResult([]);
    } else {
      seterror(null);
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user/messaging-getusers?search=${Search}`);
        setsearchResult(data)
        setLoading(false);

      } catch (error) {
        console.error('Error searching:', error);
        seterror('An error occurred while searching. Please try again later.');
      }
    }
  };



  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": " application/json"
        }
      }

      const { data } = await axios.post('/api/user/chat/', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data);
      setLoadingChat(false)

    } catch (err) {

    }
  }


  const fetchChat = async () => {
    try {


      const { data } = await axios.get('/api/user/chat/');
      setChats(data)

    } catch (err) {

    }

  }

  useEffect(() => {
    setLoggedUser(user)
    fetchChat()
  }, [])

  return (
    <div className='border-r pr-5 overflow-auto w-[400px] -mt-4'>
      <h1 className='font-bold pb-9 pt-3'>Messages</h1>
      <div onClick={onOpen} className='cursor-pointer'>
        <IoCreate className='absolute -mt-14 text-3xl right-[703px]' />
        <GroupChatModal isOpen={isOpen} onClose={onClose} />
      </div>
      <Input
        value={Search}
        onChange={handleSearch}
        placeholder='Search'
      />
      {error && <p className='text-red-600'>{error}</p>}
      {Loading ? (
        <ChatLoading />
      ) : (
        searchResult?.map(user => (
          <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => accessChat(user._id)}
          />
        ))
      )
      }

      {LoadingChat && <Spinner ml={"auto"} d="flex" />}

      <Box

        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "100%" }}
        borderRadius="lg"
        marginTop={"10px"}
      >

        {chats ? (
          <div className='overflow-clip'>
            <Stack >
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSenderName(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          </div>

        ) : (
          <p></p>
        )
        }

      </Box>

    </div>
  )
}

export default MyChats