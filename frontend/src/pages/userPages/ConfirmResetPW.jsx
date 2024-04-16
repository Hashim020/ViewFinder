import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ConfirmResetPW = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!newPassword.match(passwordRegex)) {
      setErrorMessage("Password must have at least one lowercase, one uppercase, one digit, one special character, and be at least 8 characters long");
      return;
    }
    try {
      if (newPassword !== confirmPassword) {
        return setErrorMessage("password not matching");
      }

      const response = await axios.post('api/user/confirmResetPassword', { email, newPassword });
      console.log(response.data);
      toast.success("Password changed successfully.");
      const data = response.data;
      console.log(data)
      if (data.success === true) {
        navigate('/');
      } else {
        toast.error("Error verifying OTP");
      }
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-5 bg-white rounded-lg shadow">
        <h3 className="my-4 text-2xl font-semibold text-gray-700">Reset Password</h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="newPassword" className="text-sm font-semibold text-gray-500">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-500">Confirm Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
          </div>
          <p></p>
          <div>
            <button type="submit" className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4">
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
          {errorMessage && (
            <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
          )}
          <p className='text-sm font-semibold text-gray-500'>
            Remember your password? <Link to="/" className="pl-2 font-medium text-sky-500 hover:underline dark:text-primary-500">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ConfirmResetPW;
