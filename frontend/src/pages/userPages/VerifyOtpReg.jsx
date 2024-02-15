import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterOtpVarifiedMutation } from '../../Slices/userApiSlice';

const VerifyOtpReg = () => {

    const { state } = useLocation();
    const response = state?.response;
    const { message, otp, userData } = response || {};

    const [OTP, setOTP] = useState('');
    const [RegisterOtpVarified, { isLoading }] = useRegisterOtpVarifiedMutation();

    const navigate = useNavigate();


    const handleVerifyOtp = async (e) => {
        try {
            e.preventDefault();
            if (OTP === otp) {
                const res = await RegisterOtpVarified(userData);
                console.log(res)
                toast.success("Your account has been verified now you can Login");
                const data = res.data; 
                if (data.success === "true") {
                    navigate('/');
                } else {
                    toast.error("Error verifying OTP");
                }
            } else {
                toast.error("Invalid OTP");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md p-5 bg-white rounded-lg shadow">
                <h3 className="my-4 text-2xl font-semibold text-gray-700">Verify OTP</h3>
                <p className="text-sm text-gray-500 mb-4">Enter the OTP sent to your email:</p>
                <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-5">
                    <div className="flex items-center space-x-2">
                        <input type="text" id="otp" value={OTP} onChange={(e) => setOTP(e.target.value)} className="flex-grow px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
                    </div>
                    <div>
                        <button type="submit" className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4">Verify OTP</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpReg;
