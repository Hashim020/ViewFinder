import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvide';
import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import { getSenderName } from '../../config/ChatLogics';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { BsInfoCircle } from 'react-icons/bs';
import UpdateGroupModal from '../modal/userModal/UpdateGroupModal';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import '../../assets/Css/MessageStyle.css';
import io from 'socket.io-client';
var selectedChatCompare;

const SingleChat = () => {
    const { user, selectedChat, notification,setNotification, } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const toast = useToast();
    const [typing, settyping] = useState(false)
    const [isTyping, setIstyping] = useState(false)


    const ENDPOINT = "https://www.hashimlive.online/";




    useEffect(() => {
        if (selectedChat) {
            const newSocket = io(ENDPOINT);
            newSocket.emit('setup', user);
            newSocket.on('connect', () => {
                setSocket(newSocket);
                setSocketConnected(true);
                console.log("Connected to socket");
            });
            newSocket.on('typing', () => setIstyping(true))
            newSocket.on('stop typing', () => setIstyping(false))

            return () => {
                newSocket.disconnect();
            };
        }
    }, [selectedChat, user]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat || !socketConnected) return;
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/user/chat/message/${selectedChat._id}`);
                setMessages(data);
                setLoading(false);
                socket.emit('join chat', selectedChat._id);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error Occurred!",
                    description: "Failed to Load the Messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        };

        fetchMessages(); 
        selectedChatCompare = selectedChat;
    }, [selectedChat, socket, socketConnected, toast]);


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                }
                const { data } = await axios.post('/api/user/chat/message/', {
                    content: newMessage,
                    chatId: selectedChat,
                }, config);
                setNewMessage("");
                socket.emit('new message', data);
                console.log(data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }
    useEffect(() => {
        if (socket) {
            socket.on("message recieved", (newMessageRecieved) => {
                if (
                    !selectedChatCompare || 
                    selectedChatCompare._id !== newMessageRecieved.chat._id
                ) {
                    if (!notification.includes(newMessageRecieved)) {
                      setNotification([newMessageRecieved, ...notification]);
                      setFetchAgain(!fetchAgain);
                    }
                }
                setMessages([...messages, newMessageRecieved]);

            });
        }
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
            settyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                settyping(false);
            }
        }, timerLength);
    }

    return (
        <>
        {selectedChat ? (
            <>
                <div className='ml-[1px] w-full'>
                    <p className='font-bold text-xl ml-3'>{selectedChat.isGroupChat ? selectedChat.chatName.toUpperCase() : getSenderName(user, selectedChat.users)}</p>
                    <hr />
                    <div onClick={onOpen} className='cursor-pointer -mt-6 ml-[620px]'><BsInfoCircle /></div>
                </div>
    
                <UpdateGroupModal isOpen={isOpen} onClose={onClose} />
    
                {loading ? (
                    <div className='fixed top-0 left-200 w-full h-full flex items-center justify-center bg-transparent opacity-40 z-50'>
                        <Spinner
                            size="xl"
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                        />
                    </div>
                ) : (
                    <div className="messages">
                        <ScrollableChat messages={messages} />
                    </div>
                )}
                <div className='fixed bottom-0 w-full flex justify-between'>
                    <FormControl
                        onKeyDown={sendMessage}
                        id="first-name"
                        isRequired
                        w={['calc(100% - 100px)', 'calc(100% - 100px)', '680px']} // Adjust width for different screen sizes
                        ml={[0, 0, 1]} // Adjust margin-left for different screen sizes
                    >
                        {isTyping && <p className="mt-2 ml-3">Typing..</p>}
                        <Input
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder="Enter a message.."
                            value={newMessage}
                            onChange={typingHandler}
                            width={['calc(100% - 100px)', 'calc(100% - 100px)', 680]} // Adjust width for different screen sizes
                        />
                    </FormControl>
                    <Button
                        colorScheme="blue"
                        onClick={sendMessage}
                        size="lg"
                        ml={2} // Add margin to separate from the input field
                    >
                        Send
                    </Button>
                </div>
            </>
        ) : (
            <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="2xl" className='mt-64 ml-[180px]' fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
    
    );
}

export default SingleChat;
