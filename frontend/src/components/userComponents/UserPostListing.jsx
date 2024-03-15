import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { useDisclosure } from '@chakra-ui/react';
import PostViewModal from '../../components/modal/userModal/PostViewModal';
import { useNavigate } from 'react-router-dom';

const UserPostListing = ({ posts, fetchData, userId }) => {
    const { isOpen: isPostViewModalOpen, onOpen: onPostViewModalOpen, onClose: onPostViewModalClose } = useDisclosure();
    const [reload, setReload] = useState(0);
    const [postId, setpostId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [reload]);

    const handleLikeUnlike = async (postId) => {
        try {
            const response = await axios.post('/api/user/post-LikeUnlike', { postId });
            if (response.data.success === true) {
                setReload(reload + 1);
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

    return (

        <div className="instagram-home-feed">
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        <div className="user-details pt-16 flex">
                            <img onClick={() => handleUserProfileClick(post.userId._id)} className="w-12 h-12 rounded-full inline-block cursor-pointer" src={post.userId.profileImageName.url} alt={post.userId.name} />
                            <p onClick={() => handleUserProfileClick(post.userId._id)} className='inline-block text-black ml-2 mt-3 cursor-pointer '>{post.userId.username}</p>
                            <h1 className='text-5xl ml-3 text-gray-400  leading-4 '>.</h1>
                            <h1 className='text-sm ml-1 text-gray-400  leading-[50px] '>{formatTimestamp(post.createdAt)}</h1>
                        </div>
                        <div className="post-content">
                            <img className='max-w-lg rounded-2xl pt-3' src={post.image.url} alt={post.caption.text} />
                            <div className='flex flex-wrap'>
                                {post.likes.includes(userId) ? (
                                    <FaHeart onClick={() => handleLikeUnlike(post._id)} className="mx-2 my-1 cursor-pointer text-red-500" fontSize="1.7em" />
                                ) : (
                                    <FaRegHeart onClick={() => handleLikeUnlike(post._id)} className="mx-2 my-1 hover:text-red-500 cursor-pointer" fontSize="1.7em" />
                                )}
                                <FaRegComment onClick={() => handlePostClick(post._id)} className="mx-2 my-1 cursor-pointer hover:text-green-500 " fontSize="1.7em" />
                            </div>
                            <p>{`Likes:${post.likes.length}`}</p>
                            <p>{post.caption}</p>
                            <hr />
                        </div>
                    </li>
                ))}
            </ul>
            <PostViewModal isOpen={isPostViewModalOpen} onClose={onPostViewModalClose} userPosts={posts} postId={postId} />
        </div>
    );
};

export default UserPostListing;
