import { Box, FormControl, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input
} from '@chakra-ui/react';
import { ChatState } from '../../../context/ChatProvide';
import axios from 'axios';
import UserListItem from '../../userComponents/UserListItem';
import UserBadgeItem from '../../userComponents/UserBadgeItem';

const GroupChatModal = ({ isOpen, onClose }) => {
    const [groupChatName, setgroupChatName] = useState("");
    const [selectedUsers, setselectedUsers] = useState([]);
    const [Search, setsearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    const { user, chats, setChats, } = ChatState()
    const toast = useToast()

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

    

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setselectedUsers([...selectedUsers, userToAdd]);
    };
    const handleDelete = (delUser) => {
        setselectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };








    
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
     
      const { data } = await axios.post(
        `/api/user/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        d="flex"
                        justifyContent={"center"}
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir={"column"} alignItems={"center"}>
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setgroupChatName(e.target.value)}>
                            </Input>
                        </FormControl>
                        <FormControl>
                            <Input

                                placeholder='Add Users eg: hashim'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}>
                            </Input>
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {isLoading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal