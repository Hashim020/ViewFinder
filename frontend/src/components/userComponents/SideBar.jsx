import React from 'react';
import { Sidebar } from 'flowbite-react';
import { FaHome, FaSearch, FaEnvelope, FaBell, FaEdit, FaTrophy, FaUser, FaEllipsisH } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import Logo from "../../assets/Logo.png";
import { Link } from 'react-router-dom';

const SidebarComponent = ({ items }) => {
  return (
    <div className="bg-gray-900 h-screen w-64 fixed top-0 left-0 z-10 flex flex-col justify-between" >
      <div className=" justify-center items-center flex">
        <img src={Logo} alt="Your Logo" className="h-32 w-auto" />
      </div>
      <Sidebar aria-label="Sidebar">
        <Sidebar.Items>
          {items.map((item, index) => (
            <Sidebar.ItemGroup className='mt-0'>
              <Link to={item.href} > <Sidebar.Item key={index} href={item.href} icon={item.icon} className="text-white px-9 py-4 flex items-center justify-start hover:bg-sky-950">
                {item.label}
              </Sidebar.Item></Link>
            </Sidebar.ItemGroup>
          ))}
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

const SideBar = () => {
  const sidebarItems = [
    { href: '/Home', icon: FaHome, label: 'Home' },
    { href: '#', icon: FaSearch, label: 'Search' },
    { href: '#', icon: FaEnvelope, label: 'Messages' },
    { href: '#', icon: FaBell, label: 'Notifications' },
    { href: '#', icon: FaEdit, label: 'Create post' },
    { href: '#', icon: FaTrophy, label: 'Contests' },
    { href: '/myProfile', icon: FaUser, label: 'Profile' },
    { href: '#', icon: FaEllipsisH, label: 'More' },
  ];

  return <SidebarComponent items={sidebarItems} />;
};

export default SideBar;
