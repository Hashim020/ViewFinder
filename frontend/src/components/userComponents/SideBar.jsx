import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import { FaHome, FaSearch, FaEnvelope, FaBell, FaEdit, FaTrophy, FaUser, FaEllipsisH } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import CreatePostModal from '../modal/userModal/CreatePostModal';
import Logo from "../../assets/Logo.png";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Slices/authSlice';
import { useGetUserProfileMutation } from '../../Slices/userApiSlice';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button
} from '@chakra-ui/react'

const SideBar = ({fetchData,getUserPosts}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logedUser, setlogedUser] = useState(null)
  const [getUserProfile, isloading] = useGetUserProfileMutation();


  const { userInfo } = useSelector((state) => { return state.auth });
  useEffect(() => {
    const checkblockedornor = async () => {
      if (userInfo) {
        setlogedUser(userInfo._id)
        const response = await getUserProfile()
        if (!response.data) {
          dispatch(logout());
        }

      }
    }
    checkblockedornor()
  }, [navigate, userInfo]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/")
    }
  }, [])
  const sidebarItems = [
    { href: '/Home', icon: FaHome, label: 'Home' },
    { href: '/search-user', icon: FaSearch, label: 'Search' },
    { href: '#', icon: FaEnvelope, label: 'Messages' },
    { href: '#', icon: FaBell, label: 'Notifications' },
    { href: '#', icon: FaEdit, label: 'Create post', onClick: onOpen },
    { href: '#', icon: FaTrophy, label: 'Contests' },
    { href: '/myProfile', icon: FaUser, label: 'Profile' },
    { href: '#', icon: FaEllipsisH, label: 'More', onClick: () => setPopoverOpen(true) },
  ];
  const handleLogout = async () => {
    try {
      axios.post("api/user/logout");
      dispatch(logout());
    } catch (error) {
      toast.error(error)
    }
  }



  return (
    <div className="bg-gray-900 h-screen w-64 fixed top-0 left-0 z-10 flex flex-col justify-between" >
      <div className="justify-center items-center flex">
        <Link to={'/home'} >
          <img src={Logo} alt="Your Logo" className="h-32 w-auto" />
        </Link>
      </div>
      <Sidebar aria-label="Sidebar">
        <Sidebar.Items>
          {sidebarItems.map((item, index) => (
            <Sidebar.ItemGroup className='mt-0' key={index}>
              <Link to={item.href}>
                <Sidebar.Item
                  icon={item.icon}
                  className="text-white px-9 py-4 flex items-center justify-start hover:bg-sky-950"
                  onClick={item.onClick}
                >
                  {item.label}
                </Sidebar.Item>
              </Link>
            </Sidebar.ItemGroup>
          ))}
        </Sidebar.Items>
      </Sidebar>
      <CreatePostModal fetchData={fetchData} getUserPosts={getUserPosts} isOpen={isOpen} onClose={onClose} />
      {isPopoverOpen && (
        <Popover placement="top" isOpen={isPopoverOpen} onClose={() => setPopoverOpen(false)}>
          <PopoverTrigger>
            <PopoverContent w="250px" pb={100} >
              <PopoverCloseButton />
              <PopoverHeader>More Options</PopoverHeader>
              <PopoverBody><button className='text-red-700' onClick={handleLogout}  >Logout</button></PopoverBody>
              <PopoverArrow />
            </PopoverContent>
          </PopoverTrigger>
        </Popover>
      )}
    </div>
  );
};

export default SideBar;
