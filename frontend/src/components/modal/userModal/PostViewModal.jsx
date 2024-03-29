import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Button, FormControl, FormLabel, Input, Flex, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton,InputGroup, InputRightAddon, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import Comments from '../../userComponents/Comments';
import { toast } from 'react-toastify';
import { TfiMoreAlt } from "react-icons/tfi";
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import ReportPostModal from './ReportPostMadal'

const PostViewModal = ({ isOpen, onClose, postId }) => {
    const PostViewModalonclose=onClose
    const [post, setPost] = useState(null);
    const [content, setContent] = useState("");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedCaption, setEditedCaption] = useState("");
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [currentUserId, setcurrentUserId] = useState(null)
    const [postUserId, setpostUserId] = useState(null)
    const [show, setShow] = React.useState(false);
    const { userInfo } = useSelector((state) => { return state.auth });
    const { isOpen: isReportPostModalOpen, onOpen: onReportPostModalOpen, onClose: onReportPostModalClose } = useDisclosure();

    useEffect(()=>{
        if(userInfo){
            setcurrentUserId(userInfo._id)
        }
    })

    const fetchPost = async (postId, setPost) => {
        try {
            const response = await axios.get(`/api/user/get-singlePost/${postId}`);
            setPost(response.data.post);
            setpostUserId(response.data.post.userId._id)
        } catch (error) {
            console.error('Error fetching post:', error.response.data);
        }
    };
    
    useEffect(() => {
        if (isOpen && postId) {
            fetchPost(postId, setPost);
        }
    }, [isOpen, postId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/user/get-comment/${postId}`);
            setComments(response.data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error.response.data);
        }
    };

    const handlePostComment = async () => {
        try {
            const response = await axios.post(`/api/user/post-comment`, { content, POSTID: postId });
            if (response.data.success === "true") {
                toast.success("Comment posted successfully");
                fetchComments();
            }
        } catch (error) {
            console.error('Error posting comment:', error.response.data);
        }
    };

    const handleEditPost = () => {
        setEditedCaption(post ? post.caption : "");
        setEditMode(true);
        setIsPopoverOpen(false);
    };

    const handleSubmitEdit = async () => {
        const check = editedCaption.trim();
        if (check === "") {
            return setError("Required Field");
        }
        setError("");
        try {
            const response = await axios.put(`/api/user/edit-post/${postId}`, { caption: editedCaption });
            if (response.data.success === "true") {
                toast.success("Post edited successfully");
                setEditMode(false);
                fetchPost(postId, setPost);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error('Error editing post:', error.response.data);
        }
    };

    const handleCaptionChange = (e) => {
        setEditedCaption(e.target.value);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setError("");
    };

    return (
        <Modal
        motionPreset='slideInBottom'
         size={"full"} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter="auto" backdropBlur='2px' />
            <ModalContent maxH="400px" maxW="1000px">
                <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
                    <div onClick={() => setIsPopoverOpen(!isPopoverOpen)} className='cursor-pointer'>
                        <PopoverTrigger>
                            <div className='w-2   h-2 mt-0 ' >
                                <TfiMoreAlt className='absolute h-4 w-9 right-0 mr-5 mt-3 cursor-pointer hover:shadow-neutral-800 rounded hover:shadow-lg' onClick={() => setIsPopoverOpen(!isPopoverOpen)} />
                            </div>
                        </PopoverTrigger>
                    </div>
                    <PopoverContent className='ml-44' zIndex={5} style={{ position: 'relative', right: '-630px', top: '100%' }} >
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>More Options</PopoverHeader>
                        <PopoverBody>
                            {postUserId==currentUserId ? 
                            < div className=' flex flex-col'>
                            <a variant="outline" className='cursor-pointer text-blue-700 hover:text-yellow-500' onClick={handleEditPost}>Edit Post</a>
                            <a className='text-red-600 cursor-pointer hover:shadow-lg hover:shadow-red-400 shadow-transparent rounded-lg' >Delete post</a>
                            </div>
                            :
                            <a onClick={()=>{onReportPostModalOpen()}} className='text-red-700 rounded-sm hover:shadow-inner hover:shadow-red-400 cursor-pointer'>Report</a>
                            }
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
                                    <div  className='flex pb-2 '>
                                    <img src={post.userId.profileImageName.url} alt="User Avatar" className="avatar w-[34px] h-[34px] rounded-full" />
                                    <p className='font-bold pl-1 pt-1 cursor-pointer' >{post.userId.username}</p>
                                    </div>
                                    {post.isEdited ? 
                                    <a className='text-slate-400'> Edited</a> : <a></a>
                                    }
                                    <hr />
                                </FormControl>
                                {editMode ? (
                                    <FormControl>
                                        <FormLabel>Edit Caption</FormLabel>
                                        <Input
                                            maxLength={100}
                                            type="text"
                                            value={editedCaption}
                                            onChange={handleCaptionChange}
                                            placeholder="Enter your edited caption"
                                        />
                                        <Button onClick={handleSubmitEdit}>Submit</Button>
                                        <button type="button" onClick={cancelEdit} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                            Cancel</button>
                                        <p className='text-red-500'>{error}</p>
                                    </FormControl>
                                ) : (
                                    <FormControl>
                                        <div>
                                            <p>{post.caption}</p>
                                        </div>
                                    </FormControl>
                                )}
                                <Comments fetchComments={fetchComments} comments={comments} postId={postId} />
                                <FormControl top={"120px"} id="Comment">
                                    <Input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder='Post Your Comment here' name="name" width={"410px"} />
                                    <button type="button" onClick={handlePostComment} className="text-gray-900 absolute hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800  ">POST</button>
                                </FormControl>
                                <hr />
                            </Box>
                        </Flex>
                    )}
                </ModalBody>
            </ModalContent>
            <ReportPostModal PostViewModalonclose={PostViewModalonclose} postId={postId} isOpen={isReportPostModalOpen} onClose={onReportPostModalClose}/>
        </Modal>
    );
};

export default PostViewModal;
