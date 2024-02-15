import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAdminLoginMutation } from '../../Slices/adminApiSlice';
import { setCredentials } from '../../slices/adminAuthSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useAdminLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials(response));
      navigate('/admin/get-user');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="w-full max-w-md p-5 bg-white rounded-lg shadow">
      <h3 className="my-4 text-2xl font-semibold text-gray-700">Welcome Back, Admin</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
          <input
            type="email"
            id="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
          >
            Log in
          </button>
        )}
      </form>
    </div>
  </div>
  );
};

export default AdminLoginPage;
