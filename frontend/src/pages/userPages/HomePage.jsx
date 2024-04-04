import React, { useEffect, useState } from 'react';
import SideBar from '../../components/userComponents/SideBar';
import UserPostListing from '../../components/userComponents/UserPostListing';
import axios from '../../API/axios/axiosInstance.js';
import InfiniteScroll from 'react-infinite-scroll-component';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setuserId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit,setlimit]=('3')
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setPage(1);
    try {
      const result = await axios.get('/api/user/showAllPost', {
        params: {
          page: page,
          limit: limit
        }
      });
      setPosts(result.data.data);
      setuserId(result.data.userId);
    } catch (error) {
      console.error(error);
    }
  };

  const showMore = async () => {
    try {
      const nextPage = page + 1;
      const result = await axios.get('/api/user/showAllPost', {
        params: {
          page: nextPage,
          limit: limit
        }
      });
      setPosts([...posts,...result.data.data]);
      setPage(nextPage);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar fetchData={fetchData} />
      </div>

      <div className='ml-48'>
        <UserPostListing posts={posts} fetchData={fetchData} userId={userId} />
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        next={showMore}
        hasMore={true}
      // loader={<h4>Loading...</h4>}
      />
    </div>

  );
};

export default HomePage;
