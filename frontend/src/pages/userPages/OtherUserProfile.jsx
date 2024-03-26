import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../components/userComponents/SideBar';
import blankProfilePicture from "../../assets/no-profilePicture.png"
import { useDisclosure } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import PostViewModal from '../../components/modal/userModal/PostViewModal';
import { useDispatch, useSelector } from 'react-redux';
import FollowersModal from '../../components/modal/userModal/FollowersModal';
import FollowingsModal from '../../components/modal/userModal/FollowingsModal';

const OtherUserProfile = () => {
    const { isOpen: isFollowersModalOpen, onOpen: onFollowersModalOpen, onClose: onFollowersModalClose } = useDisclosure();
    const { isOpen: isPostViewModalOpen, onOpen: onPostViewModalOpen, onClose: onPostViewModalClose } = useDisclosure();
    const { isOpen: isFollowingsModalOpen, onOpen: onFollowingsModalOpen, onClose: onFollowingsModalClose } = useDisclosure();
    const [userData, setUserData] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [postId, setPostId] = useState(null);
    const [loggeduserid, setloggeduserid] = useState(null)
    const [isFollowing, setIsFollowing] = useState(false); 
    const { userId } = useParams();
    const[ followers,setFollowers]= useState([]);
    const[followings,setFollowing]= useState([])

    const { userInfo } = useSelector((state) => { return state.auth });
    useEffect(() => {
        if (userInfo) {
            setloggeduserid(userInfo._id)
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/user/getotheruser-profile/${userId}`);
                const { data } = response;
                setUserData(data.user);
                setUserPosts(data.posts);
                setPostCount(data.posts.length);
                setIsFollowing(data.user.followers.includes(loggeduserid)); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId, loggeduserid]);

    const handlePostClick = (postId) => {
        setPostId(postId);
        onPostViewModalOpen();
    };

    const handleFollow = async (id) => {
        try {
            const follwinguserId = id;
            const response = await axios.post("/api/user/follow-user", { userId: follwinguserId });
            console.log(response);
            setIsFollowing(true); 
            setUserData(prevState => ({ ...prevState, followers: [...prevState.followers, loggeduserid] })); 
        } catch (error) {
            console.log(error);
        }
    }

    const handleUnfollow = async (id) => {
        try {
            const UnfollowingUserId = id;
            const response = await axios.post('/api/user/unfollow-user', { userId: UnfollowingUserId });
            setIsFollowing(false); 
            setUserData(prevState => ({ ...prevState, followers: prevState.followers.filter(followerId => followerId !== loggeduserid) })); 
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetFollowers = async (id)=>{
        try {
            const {data} = await axios.get(`/api/user/get-followers/${id}`);
            console.log(data.followers);
            setFollowers(data.followers);
            onFollowersModalOpen()
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetFollowing = async (id)=>{
        try {
            const {data} = await axios.get(`/api/user/get-following/${id}`);
            setFollowing(data.following);
            onFollowingsModalOpen()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
                <SideBar />
            </div>
            <div className="flex-1 h-full bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center mt-8">
                        <div className="w-full">
                            <div className="bg-white shadow-md rounded-lg">
                                {/* Profile cover */}
                                <div className="relative">
                                    {userData.profileCoverPicture ? (
                                        <img src={userData.profileCoverPicture.url} alt="Profile Cover" className="w-full h-48 object-cover rounded-t-lg" />
                                    ) : (
                                        <div className="w-full h-48 bg-black rounded-t-lg"></div>
                                    )}

                                    {/* Profile picture */}
                                    <div className="absolute left-1/2 top-32 transform -translate-x-1/2">
                                        {userData.profileImageName ? (
                                            <img src={userData.profileImageName.url} alt="Profile Picture" className="w-28 h-30 rounded-full border-4 border-white" />
                                        ) : (
                                            <img src={blankProfilePicture} alt="Alternate Profile Picture" className="w-20.5 h-32 py-1 rounded-full border-4 border-white" />
                                        )}
                                    </div>
                                </div>
                                {/* User info */}
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
                                    <p className="text-gray-600">{`@${userData.username}`}</p>
                                    {loggeduserid !== userData._id &&  
                                        <div>
                                            {!isFollowing ? (
                                                <button type="button" onClick={() => { handleFollow(userData._id) }} className="h-9 absolute bottom-[333px] left-[415px] text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Follow</button>
                                            ) : (
                                                <button type="button" onClick={() => { handleUnfollow(userData._id) }} className="h-9 absolute bottom-[333px] left-[415px] text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Unfollow</button>
                                            )}
                                        </div>
                                    }
                                    <div className="flex items-center mt-4">
                                        <div className="flex items-center mr-6">
                                            <div className="text-gray-600">
                                                <p className="text-xl font-semibold">{postCount}</p>
                                                <p className="text-sm">Posts</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center mr-6">
                                            <div className="text-gray-600">
                                                <div className='cursor-pointer hover:text-yellow-500' onClick={()=>handleGetFollowers(userData._id)} >
                                                <p className="text-xl font-semibold">{userData.followers ? userData.followers.length : 0}</p>
                                                <p className="text-sm">Followers</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center mr-6">
                                            <div className="text-gray-600">
                                            <div className='cursor-pointer hover:text-yellow-500' onClick={()=>handleGetFollowing(userData._id)} >
                                                <p className="text-xl font-semibold">{userData.following ? userData.following.length : 0}</p>
                                                <p className="text-sm">Following</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center mr-6">
                                            <div className="text-gray-600">
                                                <p className="text-xl font-semibold">0</p>
                                                <p className="text-sm">Contests</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* User posts */}
                                    <div className="mt-6">
                                        <h3 className="text-xl font-semibold text-gray-800">Posts</h3>
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {userPosts.map(post => (
                                                <div key={post._id} className="bg-gray-100 rounded-lg">
                                                    <img src={post.image.url} onClick={() => handlePostClick(post._id)} alt={post.caption} className="w-full h-44 object-cover rounded-lg" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Post view modal */}
            <PostViewModal isOpen={isPostViewModalOpen} onClose={onPostViewModalClose} userPosts={userPosts} postId={postId} />
            <FollowersModal isOpen={isFollowersModalOpen} onClose={onFollowersModalClose} followers={followers} />
            <FollowingsModal isOpen={isFollowingsModalOpen} onClose={onFollowingsModalClose} followings={followings} />
        </div>
    );
};

export default OtherUserProfile;
