import React, { useEffect, useState } from 'react';
import SideBar from '../../components/userComponents/SideBar';
import { useGetUserProfileMutation } from '../../Slices/userApiSlice';
import { FaPencil } from "react-icons/fa6";
import EditProfileModal from '../../components/modal/userModal/EditProfileModal';
import { useDisclosure } from '@chakra-ui/react';

const ProfilePage = () => {
  const [getUserProfile, isloading] = useGetUserProfileMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [userDATA, setuserDATA] = useState([]);

  const getUserData = async () => {
    try {
      const userData = await getUserProfile();
      setuserDATA(userData.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    getUserData();
  }, [isOpen]); // Refetch user data when the modal is closed

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar />
      </div>
      <div className="flex-1 h-full bg-white">
        <div className="container  mx-auto px-4">
          <div className="flex justify-center mt-8">
            <div className="w-full">
              <div className="bg-white shadow-md rounded-lg">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1549740425-5e9ed4d8cd34?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile Picture" className="w-full h-32 object-cover rounded-t-lg" />
                  <div className="absolute bottom inset-0 flex items-center justify-center">
                    <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow-md">Edit</button>
                  </div>
                  <div className="absolute pa left-1/2 transform -translate-x-1/2">
                    <img src={userDATA.profileImageName} alt="Profile Picture" className="w-30 h-30 rounded-full border-4 border-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{userDATA.name}</h2>
                  <p className="text-gray-600">{`@${userDATA.username}`}</p>
                  <div className="flex items-center mt-4">
                    <div className="flex items-center mr-6">
                      <div className="text-gray-600">
                        <p className="text-xl font-semibold">3</p>
                        <p className="text-sm">Posts</p>
                      </div>
                    </div>
                    <div className="flex items-center mr-6">
                      <div className="text-gray-600">
                        <p className="text-xl font-semibold">0</p>
                        <p className="text-sm">Followers</p>
                      </div>
                    </div>
                    <div className="flex items-center mr-6">
                      <div className="text-gray-600">
                        <p className="text-xl font-semibold">0</p>
                        <p className="text-sm">Following</p>
                      </div>
                    </div>
                    <div className="flex items-center mr-6">
                      <div className="text-gray-600">
                        <p className="text-xl font-semibold">0</p>
                        <p className="text-sm">Contests</p>
                      </div>
                    </div>
                    <FaPencil onClick={onOpen} className='cursor-pointer mr-6 size-7  hover:text-blue-700  absolute right-12' />
                    <p onClick={onOpen} className='cursor-pointer bottom-80 mr-1.5 hover:text-blue-700 size-18 absolute right-12'>Edit Profile</p>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800">Posts</h3>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-100 rounded-lg">
                        <img src="https://source.unsplash.com/random" alt="Post 1" className="w-full h-32 object-cover rounded-lg" />
                      </div>
                      <div className="bg-gray-100 rounded-lg">
                        <img src="https://source.unsplash.com/random" alt="Post 2" className="w-full h-32 object-cover rounded-lg" />
                      </div>
                      <div className="bg-gray-100 rounded-lg">
                        <img src="https://source.unsplash.com/random" alt="Post 3" className="w-full h-32 object-cover rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal isOpen={isOpen} onClose={onClose} userDATA={userDATA} />
    </div>
  );
};

export default ProfilePage;
