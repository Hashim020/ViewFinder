import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Aos from 'aos'
import '../../../node_modules/aos/dist/aos.css'


const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        backend: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let errorsObj = {};
        const spaceRegex = /\s/; 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    
        if (currentPassword === '') {
            errorsObj.currentPassword = 'Please enter your current password.';
        } else if (spaceRegex.test(currentPassword)) {
            errorsObj.currentPassword = 'Password cannot contain spaces.';
        }
    
        if (newPassword === '') {
            errorsObj.newPassword = 'Please enter a new password.';
        } else if (!passwordRegex.test(newPassword)) {
            errorsObj.newPassword = 'Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.';
        } else if (spaceRegex.test(newPassword)) {
            errorsObj.newPassword = 'Password cannot contain spaces.';
        }
    
        if (confirmPassword === '') {
            errorsObj.confirmPassword = 'Please confirm your new password.';
        } else if (newPassword !== confirmPassword) {
            errorsObj.confirmPassword = 'Passwords do not match.';
        } else if (spaceRegex.test(confirmPassword)) {
            errorsObj.confirmPassword = 'Password cannot contain spaces.';
        }
    
        setErrors(errorsObj);
    
        if (Object.keys(errorsObj).length === 0) {
            try {
                const response = await axios.post('/api/user/change-PasswordSettings', {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                });
                if(response.data.success==="true"){
                    toast.success("Updated Password")
                }
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } catch (error) {
                console.error('Error:', error.response.data);
                setErrors({ ...errorsObj, backend: error.response.data.message });
            }
        }
    };
    
    

    useEffect(()=>{
        Aos.init()

    })
    return (
        <div className="w-full  mx-auto ml-0" data-aos="fade-left">
            <h2 className="text-2xl font-bold m-5">Change Password</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-current rounded px-4 pt-6 pb-8 mb-4">
                {/* Current Password */}
                <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-gray-700 font-bold mb-2">
                        Current Password:
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.currentPassword && <div className="text-red-500 mt-1">{errors.currentPassword}</div>}
                </div>
                <Link to="/restPassword"><p className='text-sm -mt-3 pb-7 text-blue-800 cursor-pointer'>Forgot Password?</p></Link>
                {/* New Password */}
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.newPassword && <div className="text-red-500 mt-1">{errors.newPassword}</div>}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.confirmPassword && <div className="text-red-500 mt-1">{errors.confirmPassword}</div>}
                </div>

                {/* Backend Error */}
                {errors.backend && (
                    <div className="text-red-500 mt-1">
                        <p>{errors.backend}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;