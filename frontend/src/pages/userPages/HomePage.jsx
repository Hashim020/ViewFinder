import React, { useEffect, useState } from 'react';
import SideBar from '../../components/userComponents/SideBar';
import UserPostListing from '../../components/userComponents/UserPostListing';
import axios from '../../API/axios/axiosInstance.js';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setuserId] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get('/api/user/getall-posts');
      setPosts(result.data.data);
      setuserId(result.data.userId);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar fetchData={fetchData} />
      </div>

      <div className='ml-48'>
        <UserPostListing posts={posts} fetchData={fetchData} userId={userId} />
      </div>
    </div>

  );
};

export default HomePage;
