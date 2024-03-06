import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useDisclosure } from '@chakra-ui/react';
import PostViewModal from '../../components/modal/userModal/PostViewModal';
import { useNavigate } from 'react-router-dom';

  
const UserPostListing = () => {
    const { isOpen: isPostViewModalOpen, onOpen: onPostViewModalOpen, onClose: onPostViewModalClose } = useDisclosure();
    const [posts, setPosts] = useState([]);
    const [userId, setuserId] = useState(null);
    const [reload, setReload] = useState(0);
    const [postId, setpostId] = useState(null);
    const navigate=useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('/api/user/getall-posts');
                setPosts(result.data.data);
                setuserId(result.data.userId);
                console.log(result.data);
                console.log("working");
            } catch (error) {
                console.error(error);
            }
        };

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
    }
    const handlePostClick = (postId) => {
        setpostId(postId);
        onPostViewModalOpen();
    };

   const handleUserProfileClick = async (userId)=>{
    try {
        navigate(`/otheruserProfile/${userId}`);
    } catch (error) {
       console.log(error) 
    }
   }

    return (
        <div className="instagram-home-feed">
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        <div className="user-details pt-16 flex">
                            <img onClick={()=>handleUserProfileClick(post.userId._id)} className="w-12 h-12 rounded-full inline-block cursor-pointer" src={post.userId.profileImageName.url} alt={post.userId.name} />
                            <p onClick={()=>handleUserProfileClick(post.userId._id)} className='inline-block text-black ml-2 mt-3 cursor-pointer '>{post.userId.name}</p>
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
