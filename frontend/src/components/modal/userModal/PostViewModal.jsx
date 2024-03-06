import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Button, FormControl, FormLabel, Input, Flex, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton } from '@chakra-ui/react';
import axios from 'axios';
import Comments from '../../userComponents/Comments';
import { toast } from 'react-toastify';
import { MdOutlineMore } from "react-icons/md";
import { useSelector } from 'react-redux';

const PostViewModal = ({ isOpen, onClose, postId, userPosts }) => {
    const post = userPosts.find(post => post._id === postId);
    const POSTID = postId;
    const [content, setContent] = useState("");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedCaption, setEditedCaption] = useState(post ? post.caption : "");
    const [comments, setComments] = useState([]);


    const { userInfo } = useSelector((state) => state.auth);
    const fetchComments = async () => {
        try {
          const response = await axios.get(`/api/user/get-comment/${postId}`);
          setComments(response.data.comments);
        } catch (error) {
          console.error('Error fetching comments:', error.response.data);
        }
      };    
    useEffect(() => {
        // Reset state when modal is closed
        if (!isOpen) {
            setEditMode(false);
            setEditedCaption(post ? post.caption : "");
            setContent("");
        }
    }, [isOpen, post]);

    const handlePostComment = async () => {
        try {
            const response = await axios.post(`/api/user/post-comment`, { content, POSTID });
            if (response.data.success === "true") {
                toast.success("commented");
                fetchComments()
            }
        } catch (error) {
            console.error('Error posting comment:', error.response.data);
        }
    };

    const handleEditPost = () => {
        setEditMode(true);
        setIsPopoverOpen(false);
    };

    const handleSubmitEdit = async () => {
        try {
            const response = await axios.put(`/api/user/edit-post/${postId}`, { caption: editedCaption });
            if (response.data.success === "true") {
                toast.success(response.data.message);
                setEditMode(false);
            }
        } catch (error) {
            console.error('Error editing post:', error.response.data);
        }
    };

    return (
        <Modal size={"full"} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter="auto" backdropBlur='2px' />
            <ModalContent maxH="400px" maxW="1000px">
                <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
                    <div className=''>
                        <PopoverTrigger>
                            <MdOutlineMore className='absolute h-4 w-9 right-0 mr-5 mt-3 cursor-pointer' onClick={() => setIsPopoverOpen(!isPopoverOpen)} />
                        </PopoverTrigger>
                    </div>
                    <PopoverContent zIndex={5} style={{ position: 'relative', right: '-630px', top: '100%' }} >
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>More Options</PopoverHeader>
                        <PopoverBody>
                            <Button variant="outline" onClick={handleEditPost}>Edit Post</Button>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <ModalBody>
                    {post && (
                        <Flex>
                            <Box flex="1">
                                <img src={post.image.url} alt="Uploaded" style={{ maxWidth: '100%' }} />
                            </Box>
                            <Box flex="1" ml={4}>
                                <FormControl mb={4}>
                                    <FormLabel>User Info</FormLabel>
                                    <hr />
                                </FormControl>
                                {editMode ? (
                                    <FormControl>
                                        <FormLabel>Edit Caption</FormLabel>
                                        <Input
                                            type="text"
                                            value={editedCaption}
                                            onChange={(e) => setEditedCaption(e.target.value)}
                                            placeholder="Enter your edited caption"
                                        />
                                        <Button onClick={handleSubmitEdit}>Submit</Button>
                                    </FormControl>
                                ) : (
                                    <FormControl>
                                        <FormLabel>Caption</FormLabel>
                                        <p>{post.caption}</p>
                                    </FormControl>
                                )}
                                <Comments fetchComments={fetchComments} comments={comments}  postId={POSTID} />
                                <FormControl top={"120px"} id="Comment">
                                    <Input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder='Post Your Comment here' name="name" width={"410px"} />
                                    <button type="button" onClick={handlePostComment} className="text-gray-900 absolute hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">POST</button>
                                </FormControl>
                                <hr />
                            </Box>
                        </Flex>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PostViewModal;
