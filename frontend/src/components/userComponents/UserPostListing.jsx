import React, { useEffect, useState } from 'react';
import axios from '../../API/axios/axiosInstance.js';
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Heart from "react-animated-heart";
import Calendar from './Calendar';
import PostViewModal from '../../components/modal/userModal/PostViewModal';
import LikedUsersModal from '../modal/userModal/LikedUsersModal.jsx';
import Aos from 'aos'
import '../../../node_modules/aos/dist/aos.css'



const UserPostListing = ({ posts, fetchData, userId }) => {
    const { isOpen: isPostViewModalOpen, onOpen: onPostViewModalOpen, onClose: onPostViewModalClose } = useDisclosure();
    const { isOpen: isLikedUsersModalOpen, onOpen: onLikedUsersModalOpen, onClose: onLikedUsersModalClose } = useDisclosure();
    const [isClick, setClick] = useState(false);
    const [reload, setReload] = useState(0);
    const [postId, setpostId] = useState(null);
    const navigate = useNavigate();
    const [likedUsers, setLikedUsers] = useState([]);
    useEffect(() => {
        Aos.init()
        fetchData()
    }, [reload]);

    const handleLikeUnlike = async (postId) => {
        try {
            const response = await axios.post('/api/user/post-LikeUnlike', { postId });
            if (response.data.success === true) {
                setReload(reload + 1);
                setClick(!isClick)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePostClick = (postId) => {
        setpostId(postId);
        onPostViewModalOpen();
    };

    const handleUserProfileClick = async (userId) => {
        try {
            navigate(`/otheruserProfile/${userId}`);
        } catch (error) {
            console.log(error)
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffMs = now - postDate;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) {
            return 'just now';
        } else if (diffHours < 1) {
            return `${diffMinutes}M${diffMinutes > 1 ? '' : ''} ago`;
        } else if (diffDays < 1) {
            return `${diffHours}Hr${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays}d${diffDays > 1 ? '' : ''} ago`;
        }
    };
    const handleGetLikesUsers = async (postID) => {
        try {
            const { data } = await axios.get(`/api/user/get-likedusers/${postID}`)
            console.log(data);
            setLikedUsers(data)
            onLikedUsersModalOpen()
        } catch (error) {

        }
    }


    return (
        < div className='flex ' >
            <div className="instagram-home-feed" >
                <ul>
                    {posts.map((post) => (
                        <li key={post._id} data-aos="fade-right">
                            <div className="user-details pt-16 flex">
                                <img onClick={() => handleUserProfileClick(post.userId._id)} className="w-12 h-12 rounded-full inline-block cursor-pointer" src={post.userId.profileImageName.url} alt={post.userId.name} />
                                <p onClick={() => handleUserProfileClick(post.userId._id)} className='inline-block text-black ml-2 mt-3 cursor-pointer '>{post.userId.username}</p>
                                <h1 className='text-5xl ml-3 text-gray-400  leading-4 '>.</h1>
                                <h1 className='text-sm ml-1 text-gray-400  leading-[50px] '>{formatTimestamp(post.createdAt)}</h1>
                            </div>
                            <div className="post-content">
                                <img className='max-w-lg rounded-2xl w-[450px] pt-3' onDoubleClick={() => handleLikeUnlike(post._id)} src={post.image.url} alt={post.caption.text} />
                                <div className='flex flex-wrap'>
                                    <div className='-mt-[32px] -ml-8'>
                                        {post.likes.includes(userId) ? (
                                            <Heart
                                                isClick={true}
                                                onClick={() => {
                                                    handleLikeUnlike(post._id);
                                                    setClick(false);
                                                }}
                                            />
                                        ) : (
                                            <Heart
                                                isClick={false}
                                                onClick={() => {
                                                    handleLikeUnlike(post._id);
                                                    setClick(true);
                                                }}
                                            />
                                        )}
                                    </div>
                                    <FaRegComment onClick={() => handlePostClick(post._id)} className="mx-2 -ml-4 my-1 cursor-pointer hover:text-amber-500 rounded-md  " fontSize="1.7em" />
                                </div>
                                <div className='-mt-6 ml-1'>
                                    <p onClick={() => handleGetLikesUsers(post._id)} className='cursor-pointer w-80 hover:text-amber-600'>{`Likes:${post.likes.length}`}</p>
                                    <p>{post.caption}</p>
                                </div>
                                <hr />
                            </div>
                        </li>
                    ))}
                </ul>
                <PostViewModal isOpen={isPostViewModalOpen} onClose={onPostViewModalClose} userPosts={posts} postId={postId} />
                <LikedUsersModal isOpen={isLikedUsersModalOpen} onClose={onLikedUsersModalClose} likedUsers={likedUsers} />
            </div>
            <div >
                <Calendar data-aos="zoom-out-up" />
            </div>
        </div>
    );
};

export default UserPostListing;
