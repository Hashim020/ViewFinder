import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AdminSideBar from '../../components/adminComponents/AdminSideBar';
import BarChart from '../../components/adminComponents/BarChart';
const HomePage = () => {
  const navigate = useNavigate()
  const { adminInfo } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (adminInfo) {
      navigate('/admin/Home');
    } else {
      navigate('/admin');
    }
  }, [adminInfo, navigate]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <AdminSideBar />
      </div>
      <div className="flex-1 h-full bg-white p-3 rounded-md shadow-md w-1/3">
        <h2 className="text-lg font-semibold mb-2">Chart Title</h2>
        <div className="overflow-hidden">
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
