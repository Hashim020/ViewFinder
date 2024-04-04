import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import SideBar from '../../components/userComponents/SideBar';
import { useGetUserProfileMutation } from '../../Slices/userApiSlice';
import { FaPencil } from "react-icons/fa6";
import EditProfileModal from '../../components/modal/userModal/EditProfileModal';
import blankProfilePicture from "../../assets/no-profilePicture.png"
import { useDisclosure } from '@chakra-ui/react';
import SetProfilePicture from '../../components/modal/userModal/SetProfilePictureModal';
import SetCoverPicture from '../../components/modal/userModal/SetCoverPicture';
import PostViewModal from '../../components/modal/userModal/PostViewModal';
import FollowersModal from '../../components/modal/userModal/FollowersModal';
import FollowingsModal from '../../components/modal/userModal/FollowingsModal';
import Aos from 'aos'
import '../../../node_modules/aos/dist/aos.css'

const ProfilePage = () => {
  const [getUserProfile, isloading] = useGetUserProfileMutation();
  const { isOpen: isEditProfileModalOpen, onOpen: onEditProfileModalOpen, onClose: onEditProfileModalClose } = useDisclosure();
  const { isOpen: isSetProfilePictureModalOpen, onOpen: onSetProfilePictureModalOpen, onClose: onSetProfilePictureModalClose } = useDisclosure();
  const { isOpen: isSetCoverPictureOpen, onOpen: onSetCoverPictureOpen, onClose: onSetSetCoverPictureClose } = useDisclosure();
  const { isOpen: isPostViewModalOpen, onOpen: onPostViewModalOpen, onClose: onPostViewModalClose } = useDisclosure();
  const { isOpen: isFollowersModalOpen, onOpen: onFollowersModalOpen, onClose: onFollowersModalClose } = useDisclosure();
  const { isOpen: isFollowingsModalOpen, onOpen: onFollowingsModalOpen, onClose: onFollowingsModalClose } = useDisclosure();

  const [userDATA, setuserDATA] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [postCount, setpostCount] = useState(0);
  const [postId, setpostId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowing] = useState([])

  const handlePostClick = (postId) => {
    setpostId(postId);
    onPostViewModalOpen();
  };

  const getUserData = async () => {
    try {
      const userData = await getUserProfile();
      setuserDATA(userData.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await axios.get('/api/user/getuser-post');
      setUserPosts(response.data.data);
      setpostCount(response.data.data.length);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    getUserData();
    getUserPosts();
    Aos.init()
  }, [isEditProfileModalOpen, isSetProfilePictureModalOpen]);

  const handleGetFollowers = async (id) => {
    try {
      const { data } = await axios.get(`/api/user/get-followers/${id}`);
      console.log(data.followers);
      setFollowers(data.followers);
      onFollowersModalOpen()
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetFollowing = async (id) => {
    try {
      const { data } = await axios.get(`/api/user/get-following/${id}`);
      setFollowing(data.following);
      onFollowingsModalOpen()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar getUserPosts={getUserPosts} />
      </div>
      <div className="flex-1 h-full bg-white" data-aos="fade-right" >
        <div className="container  mx-auto px-4">
          <div className="flex justify-center mt-8">
            <div className="w-full">
              <div className="bg-white shadow-md rounded-lg">
                <div className="relative">
                  {userDATA.profileCoverPicture ? (
                    <img src={userDATA.profileCoverPicture.url} alt="Profile Cover" className="w-full h-48 object-cover rounded-t-lg" />
                  ) : (
                    <div className="w-full h-48 bg-black rounded-t-lg"></div>
                  )}
                  <div className="absolute bottom inset-0 flex items-center justify-center">
                    <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow-md" onClick={onSetCoverPictureOpen} >Edit</button>
                  </div>
                  <div className="absolute  left-1/2 top-32 transform -translate-x-1/2">
                    {userDATA.profileImageName ? (
                      <img src={userDATA.profileImageName.url} alt="Profile Picture" onClick={onSetProfilePictureModalOpen} className="w-28 h-30  rounded-full border-4 border-white" />
                    ) : (
                      <img src={blankProfilePicture} alt="Alternate Profile Picture" onClick={onSetProfilePictureModalOpen} className="w-20.5 h-32 py-1 rounded-full border-4 border-white" />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{userDATA.name}</h2>
                  <p className="text-gray-600">{`@${userDATA.username}`}</p>
                  <div className="flex items-center mt-4">
                    <div className="flex items-center mr-6">
                      <div className="text-gray-600">
                        <p className="text-xl font-semibold">{postCount}</p>
                        <p className="text-sm">Posts</p>
                      </div>
                    </div>
                    <div className="flex items-center mr-6">
                      <div onClick={() => handleGetFollowers(userDATA._id)} className="text-gray-600 cursor-pointer hover:text-amber-600 ">
                        <p className="text-xl font-semibold">{userDATA && userDATA.followers?.length}</p>
                        <p className="text-sm">Followers</p>
                      </div>
                    </div>
                    <div className="flex items-center mr-6">
                      <div onClick={() => handleGetFollowing(userDATA._id)} className="text-gray-600 cursor-pointer hover:text-amber-600">
                        <p className="text-xl font-semibold">{userDATA && userDATA.following?.length}</p>
                        <p className="text-sm">Following</p>
                      </div>
                    </div>
                    <div className="flex items-center mr-6">
                      <div className="text-gray-600">
                        <p className="text-xl font-semibold">0</p>
                        <p className="text-sm">Contests</p>
                      </div>
                    </div>
                    <FaPencil onClick={onEditProfileModalOpen} className='cursor-pointer mr-6 size-7  hover:text-blue-700  absolute right-12' />
                    <p onClick={onEditProfileModalOpen} className='cursor-pointer bottom-80 mr-1.5 hover:text-blue-700 size-18 absolute right-12'>Edit Profile</p>
                  </div>
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
      <EditProfileModal isOpen={isEditProfileModalOpen} onClose={onEditProfileModalClose} userDATA={userDATA} />
      <SetProfilePicture isOpen={isSetProfilePictureModalOpen} onClose={onSetProfilePictureModalClose} />
      <SetCoverPicture isOpen={isSetCoverPictureOpen} onClose={onSetSetCoverPictureClose} />
      <PostViewModal isOpen={isPostViewModalOpen} onClose={onPostViewModalClose} userPosts={userPosts} postId={postId} />
      <FollowersModal isOpen={isFollowersModalOpen} onClose={onFollowersModalClose} followers={followers} />
      <FollowingsModal isOpen={isFollowingsModalOpen} onClose={onFollowingsModalClose} followings={followings} />

    </div>
  );
};

export default ProfilePage;
