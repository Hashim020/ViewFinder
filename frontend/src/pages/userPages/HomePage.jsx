import React from 'react';
import SideBar from '../../components/userComponents/SideBar';
import ProfilePage from './ProfilePage';
const HomePage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar />
      </div>
      <div  className=" flex-1 h-full bg-white">
        <ProfilePage/>
      </div>
    </div>
  );
};

export default HomePage;
