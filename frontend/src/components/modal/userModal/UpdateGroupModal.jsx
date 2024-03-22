import React, { useState } from 'react'
import { Box, useDisclosure, useToast } from '@chakra-ui/react'
import { ChatState } from '../../../context/ChatProvide'


import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    Input
} from '@chakra-ui/react'
import UserBadgeItem from '../../userComponents/UserBadgeItem'
import axios from 'axios'
import { Spinner } from 'flowbite-react'
import UserListItem from '../../userComponents/UserListItem'



const UpdateGroupModal = ({ isOpen, onClose }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const [groupChatName, setgroupChatName] = useState('');
    const [Search, setsearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast();


    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setisLoading(true);
            
            const { data } = await axios.put(
                `/api/user/chat/group-remove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            // setFetchAgain(!fetchAgain);
            fetchMessages();
            setisLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setisLoading(false);
        }
        setgroupChatName("");
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const { data } = await axios.put(
                `/api/user/chat/group-rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
            );

            console.log(data._id);
            // setSelectedChat("");
            setSelectedChat(data);
            // setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setgroupChatName("");
    };


    const handleSearch = async (query) => {
        setsearch(query)
        if (!query) {
            return
        }

        try {
            setisLoading(true);
            const { data } = await axios.get(`/api/user/messaging-getusers?search=${Search}`);
            setisLoading(false);
            setsearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setisLoading(true);

            const { data } = await axios.put(
                `/api/user/chat/group-add`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
            );

            setSelectedChat(data);
            //   setFetchAgain(!fetchAgain);
            setisLoading(false);
            setsearch("")
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setisLoading(false);
        } finally {
            setgroupChatName("");
            setsearch("");
            setsearchResult([])

        }
    };



    return (
        <>


            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl d="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setgroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {isLoading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>)
}

export default UpdateGroupModal