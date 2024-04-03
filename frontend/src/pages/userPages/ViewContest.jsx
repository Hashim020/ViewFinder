import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../../components/userComponents/SideBar';
import axios from '../../API/axios/axiosInstance.js';
import { howItWorksContest } from '../../constants/constants.js';
import { Image } from '@chakra-ui/react';
import Aos from 'aos';

const ViewContest = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState({});
  const [daysLeft, setDaysLeft] = useState(null);
  const [entrie,setEntries]= useState(null);
  const [peoples,setpeoples]= useState(null)

  const fetchContest = async () => {
    try {
      const { data } = await axios.get(`/api/user/Contest/get-selected/${contestId}`);
      console.log(data.data);
      setContest(data.data);
      calculateDaysLeft(data.data.expiryDate);
      setEntries(data.data.participation.length);
      setpeoples(data.data.participants.length)
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  };

  useEffect(() => {
    Aos.init();
    fetchContest();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar />
      </div>

      <div data-aos="zoom-in-right" className='ml-1'>
        <div style={{ backgroundImage: `url("${contest.coverPhoto}")` }} className="justify-center bg-cover bg-center bg-no-repeat items-center w-[1110px] h-[400px] relative">
          <div className='absolute top-[40%] left-14 transform translate[-50%,-50%]'>
            <h1 className="text-5xl text-center font-extrabold font-mono text-white">{contest.contestName}</h1>
            <p className='w-[800px] text-center ml-[101px] text-white '>{contest.contestDescription}</p>
          </div>
        </div>
        <div className="bg-white shadow-2xl rounded-sm ml-8 mt-5 w-[1050px]">
          <h1 className='font-bold'>How It works</h1>
          <hr />
          <div className='flex gap-2'>
            <p className="text-gray-700 pt-3 w-[740px] text-justify border-r  mb-4">
              {howItWorksContest}
            </p>
            <div>
              <h1 className='text-center text-2xl text-yellow-600'>Powerd by viewFinder</h1>
              <hr className='w-[290px] pb-3' />
              {daysLeft !== null && <p className="text-gray-700 ">Expires in: <span className='font-extrabold'>{daysLeft}</span> days to enter</p>}
              <p className="text-gray-700 "><span className='font-extrabold'>{entrie}</span> Photos Entered </p>
              <p className="text-gray-700 "><span className='font-extrabold'>{peoples}</span> photographers</p>
            </div>
          </div>
          <h1 className='text-center font-extrabold text-green-600 text-2xl'>All entries so far</h1>
          <div className='w-[600px]'>
            {contest.participation && contest.participation.map((participation) => (
              <Image
                key={participation._id} 
                src={participation.image.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContest;
