import React from 'react';
import { Sidebar } from 'flowbite-react';
import { FaHome, FaSearch, FaEnvelope, FaBell, FaEdit, FaTrophy, FaUser, FaEllipsisH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import CreatePostModal from '../modal/userModal/CreatePostModal';
import Logo from "../../assets/Logo.png";

const SideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sidebarItems = [
    { href: '/Home', icon: FaHome, label: 'Home' },
    { href: '#', icon: FaSearch, label: 'Search' },
    { href: '#', icon: FaEnvelope, label: 'Messages' },
    { href: '#', icon: FaBell, label: 'Notifications' },
    { href: '#', icon: FaEdit, label: 'Create post', onClick: onOpen }, // Use onOpen to trigger the modal
    { href: '#', icon: FaTrophy, label: 'Contests' },
    { href: '/myProfile', icon: FaUser, label: 'Profile' },
    { href: '#', icon: FaEllipsisH, label: 'More' },
  ];

  return (
    <div className="bg-gray-900 h-screen w-64 fixed top-0 left-0 z-10 flex flex-col justify-between" >
      <div className="justify-center items-center flex">
        <img src={Logo} alt="Your Logo" className="h-32 w-auto" />
      </div>
      <Sidebar aria-label="Sidebar">
        <Sidebar.Items>
          {sidebarItems.map((item, index) => (
            <Sidebar.ItemGroup className='mt-0' key={index}>
              <Link to={item.href}>
                <Sidebar.Item
                  icon={item.icon}
                  className="text-white px-9 py-4 flex items-center justify-start hover:bg-sky-950"
                  onClick={item.onClick} // Trigger onOpen when clicking on "Create post" tab
                >
                  {item.label}
                </Sidebar.Item>
              </Link>
            </Sidebar.ItemGroup>
          ))}
        </Sidebar.Items>
      </Sidebar>
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default SideBar;
