import React, { useState } from 'react';
import SideBar from '../../components/userComponents/SideBar';
import axios from 'axios';
import blankimage from '../../assets/no-profilePicture.png';
import { useNavigate } from 'react-router-dom';

const SearchUser = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async (e) => {
    try {
      const trimmed = e.target.value.trim();
      if (trimmed === '') {
        setSearchKeyword('');
        setUsers([]);
        return setError('Please enter anything');
      }
      setSearchKeyword(trimmed);
      const response = await axios.post('/api/user/user-search', { searchTerm: trimmed });
      console.log(`response: ${response}`);
      setError('');
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
      setError('An error occurred while searching.');
    }
  };
  const navigate = useNavigate()

  const handleUserProfileClick = async (userId) => {
    try {
        navigate(`/otheruserProfile/${userId}`);
    } catch (error) {
        console.log(error)
    }
}

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-200">
        <SideBar />
      </div>
      <div className="ml-48 w-[500px] border-r">
        <div className="absolute top-6 left-[360px]">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <input
            onChange={handleSearch}
            className="bg-gray-300 rounded-full w-[500px] text-black border border-yellow-500 p-2"
            type="text"
            value={searchKeyword}
            placeholder="Search"
          />
          <p className='text-red-600' >{error}</p>
          <div>
            {users.map((user) => (
              <div  key={user._id} className="flex items-center space-x-2 mt-4">
                <img 
                  src={user.profileImageName ? user.profileImageName.url : blankimage}
                  alt={user.name}
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p onClick={() => handleUserProfileClick(user._id)}  className="font-bold cursor-pointer text-gray-600">{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
