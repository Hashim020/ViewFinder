import React, { useState, useEffect } from 'react';
import SideBar from '../../components/userComponents/SideBar';
import axios from '../../API/axios/axiosInstance.js';
import socketIOClient from 'socket.io-client';
import { ImCross } from "react-icons/im";
import Aos from 'aos'



const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [reload, setReload] = useState(false);

  const socket = socketIOClient('https://www.hashimlive.online');
  socket.on('notification', () => {
    if (!reload) {
      setReload(true);
    } else {
      setReload(false);
    }
  });

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/user/notification');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    Aos.init()
    fetchNotifications();
  }, [reload]);

  const categorizeNotifications = (notification) => {
    const timestamp = new Date(notification.timestamp);
    const now = new Date();
    const diffInMilliseconds = Math.abs(now - timestamp);
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.abs(now.getMonth() - timestamp.getMonth());

    if (diffInSeconds < 60) {
      return 'Just Now';
    } else if (timestamp.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (diffInDays < 7) {
      return 'This Week';
    } else if (now.getMonth() === timestamp.getMonth()) {
      return 'This Month';
    } else {
      return 'Older';
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar />
      </div>

      <div className='ml-2 border-r  w-[700px]' data-aos="fade-up">
        <h1 className='text-3xl font-mono text-center mt-4 font-bold'>Notifications</h1>
        <div>
          {notifications.length > 0 ? (
            <>
              {notifications.some(notification => categorizeNotifications(notification) === 'Just Now') && (
                <p className='font-bold ml-2'>this week</p>
              )}
              {notifications.filter(notification => categorizeNotifications(notification) === 'Just Now').map((notification, index) => (
                <div key={index} className='flex items-center justify-between p-4 border-b'>
                  <div className="flex items-center gap-4">
                    <img src={notification.sender.profileImageName.url} alt="profile pix" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{notification.sender.username}</p>
                      <p className="text-sm">{notification.content}</p>
                    </div>
                  </div>
                  {notification.postId &&
                    <img src={notification.postId.image.url} alt="post" className="w-12 h-12 rounded" />
                  }                </div>
              ))}
              {notifications.some(notification => categorizeNotifications(notification) === 'Today') && (
                <p className='font-bold ml-2'>this week</p>
              )}
              {notifications.filter(notification => categorizeNotifications(notification) === 'Today').map((notification, index) => (
                <div key={index} className='flex items-center justify-between p-4 border-b'>
                  <div className="flex items-center gap-4">
                    <img src={notification.sender.profileImageName.url} alt="profile pix" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{notification.sender.username}</p>
                      <p className="text-sm">{notification.content}</p>
                    </div>
                  </div>
                  {notification.postId &&
                    <img src={notification.postId.image.url} alt="post" className="w-12 h-12 rounded" />
                  }                </div>
              ))}
              {notifications.some(notification => categorizeNotifications(notification) === 'This Week') && (
                <p className='font-bold ml-2'>this week</p>
              )}
              {notifications.filter(notification => categorizeNotifications(notification) === 'This Week').map((notification, index) => (
                <div key={index} className='flex items-center justify-between p-4 border-b'>
                  <div className="flex items-center gap-4">
                    <img src={notification.sender.profileImageName.url} alt="profile pix" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{notification.sender.username}</p>
                      <p className="text-sm">{notification.content}</p>
                    </div>
                  </div>
                  {notification.postId &&
                    <img src={notification.postId.image.url} alt="post" className="w-12 h-12 rounded" />
                  }                </div>
              ))}
               {notifications.some(notification => categorizeNotifications(notification) === 'This Month') && (
                <p className='font-bold ml-2'>this week</p>
              )}
              {notifications.filter(notification => categorizeNotifications(notification) === 'This Month').map((notification, index) => (
                <div key={index} className='flex items-center justify-between p-4 border-b'>
                  <div className="flex items-center gap-4">
                    <img src={notification.sender.profileImageName.url} alt="profile pix" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{notification.sender.username}</p>
                      <p className="text-sm">{notification.content}</p>
                    </div>
                  </div>
                  {notification.postId &&
                    <img src={notification.postId.image.url} alt="post" className="w-12 h-12 rounded" />
                  }
                </div>
              ))}
            </>
          ) : (
            <div className='flex gap-2 font-bold text-xl'>

              <div className='text-red-700 mt-60 ml-[240px]'>
                <ImCross />
              </div>
              <div className='mt-[236px]'>
                <p>No Notifications Yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
