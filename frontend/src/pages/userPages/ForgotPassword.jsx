import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emaildOTP,setemaildOTP]= useState("")

  const navigate= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post('http://localhost:5000/api/user/forgot-password', { email });
      console.log(response.data);
      setIsOtpSent(true);
      toast.success("OTP sent successfully. Please check your email.");
      const data=response.data;
      var OTP= data.otp
      setemaildOTP(OTP)
    } catch (error) {
      console.error('Error:', error.response.data.message);
      setErrorMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if(emaildOTP  ==otp){
      toast.success("otp is valid")
      navigate('/confirmResetPassword');
    }
    if(emaildOTP!=otp){
      toast.error("Invalid OTP")
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-5 bg-white rounded-lg shadow">
        <h3 className="my-4 text-2xl font-semibold text-gray-700">{isOtpSent ? 'Verify OTP' : 'Forgot Password'}</h3>
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit} className="flex flex-col space-y-5">
          {isOtpSent ? (
            <div className="flex flex-col space-y-1">
              <label htmlFor="otp" className="text-sm font-semibold text-gray-500">Enter OTP</label>
              <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
            </div>
          )}
          <div>
            <button type="submit" className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4">
              {isLoading ? 'Sending...' : isOtpSent ? 'Verify OTP' : 'Send OTP'}
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

export default ForgotPasswordPage;
