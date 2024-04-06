import React from 'react'
import SideBar from '../../components/userComponents/SideBar';
import axios from '../../API/axios/axiosInstance.js';


const Notifications = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar />
      </div>

      <div className='ml-2 border-r w-[700px]'>
        <h1 className='text-3xl font-mono text-center mt-4 font-bold  '>Notifications</h1>
      </div>
    </div>
  )
}

export default Notifications