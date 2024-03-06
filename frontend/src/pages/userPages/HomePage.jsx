import React from 'react';
import SideBar from '../../components/userComponents/SideBar';
import UserPostListing from '../../components/userComponents/UserPostListing';
const HomePage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar />
      </div>
      <div className='ml-48'>
      <UserPostListing/>
      </div>
    </div>
  );
};

export default HomePage;
