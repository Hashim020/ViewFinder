import React, { useState, useEffect } from 'react';
import { useUpdateUserProfileMutation } from '../../../Slices/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Spinner
} from '@chakra-ui/react';

const EditProfileModal = ({ isOpen, onClose, userDATA }) => {
    const [isLoading, setloading] = useState(false)
    const navigate = useNavigate();
    const [updateUserProfile, { isLoading: isUpdateLoading }] = useUpdateUserProfileMutation();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
        gender: ''
    });

    useEffect(() => {
        if (userDATA) {
            const formattedDateOfBirth = userDATA.birthdate ? userDATA.birthdate.split('T')[0] : '';
            setUserData({
                name: userDATA.name || '',
                email: userDATA.email || '',
                password: '',
                dateOfBirth: formattedDateOfBirth,
                gender: userDATA.gender || ''
            });
        }
    }, [userDATA]);

    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otpData, setOtpData] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const { name, email, password, dateOfBirth, gender, } = userData;
            const formattedDateOfBirth = userDATA.birthdate ? userDATA.birthdate.split('T')[0] : '';
            if (
                name === userDATA.name &&
                email === userDATA.email &&
                dateOfBirth === formattedDateOfBirth &&
                gender === userDATA.gender &&
                password == ''
            ) {
                setError("No changes to save");
                return;
            }
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(email)) {
                setError("Enter a Valid Email");
                return
            } else {
                setError("")
            }
            const trimedpw = password.trim();
            if (!name || !email || !dateOfBirth || !gender) {
                setError("Please fill out all fields");
                return;
            }



            if (email !== userDATA.email) {
                setloading(true)
                const otpResponse = await axios.get('/api/user/otp-generateForeditProfile', {
                    params: { email }
                });

                const otpData = otpResponse.data;
                console.log(otpData);
                if (otpData.success === "true") {
                    setOtpData(otpData);
                    setOtpModalOpen(true);
                    setloading(false)
                    setError('');
                } else {
                    setError("Failed to send OTP to your new email.");
                    return;
                }
            } else {
                const updatedUserData = { name, email, dateOfBirth, gender };
                if (trimedpw != '') {
                    updatedUserData.password = password;
                }
                await updateUserProfileAndClose(updatedUserData);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError("Error updating profile");
        }
    };

    const updateUserProfileAndClose = async (updatedUserData) => {
        try {
            const response = await updateUserProfile(updatedUserData);
            const resp = response.data;
            console.log(resp.success);
            if (resp.success === "true") {
                toast.success("Successfully Updated");
                setloading(false)
                onClose();
                setError('');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError("Error updating profile");
        }
    };

    const handleVerifyOTP = async (otp) => {
        try {
            const { name, email, dateOfBirth, gender } = userData;
            const updatedUserData = { name, email, dateOfBirth, gender };
            updateUserProfileAndClose(updatedUserData);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError("Error updating profile");
        }
    };

    return (
        <>
            <Modal motionPreset='slideInRight' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent marginStart='900px'>
                    <ModalHeader>Edit Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="username">
                            <FormLabel>User Name</FormLabel>
                            <Input type="text" name="name" value={userData.name} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="dateOfBirth">
                            <FormLabel>Date of Birth</FormLabel>
                            <Input type="date" name="dateOfBirth" value={userData.dateOfBirth} max={new Date().toISOString().split('T')[0]} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="gender">
                            <FormLabel>Gender</FormLabel>
                            <Select placeholder="Select gender" name="gender" value={userData.gender} onChange={handleChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Select>
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Enter New Email</FormLabel>
                            <Input type="email" name="email" value={userData.email} onChange={handleChange} />
                        </FormControl>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {isLoading ? (<Spinner />) : (<Button variant='ghost' onClick={handleSave} >
                            Save
                        </Button>)}
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <OtpVerificationModal
                isOpen={otpModalOpen}
                onClose={() => setOtpModalOpen(false)}
                otpData={otpData}
                onVerifyOTP={handleVerifyOTP}
            />
        </>
    );
};

const OtpVerificationModal = ({ isOpen, onClose, otpData, onVerifyOTP }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState("")
    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerify = () => {
        if (otp === otpData.otp) {
            onVerifyOTP(otp);
            onClose()
        } else {
            setError("Invalid OTP. Please retry.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Verify OTP</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Enter OTP</FormLabel>
                        <Input type="text" value={otp} onChange={handleChange} />
                    </FormControl>
                </ModalBody>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleVerify}>
                        Verify
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;
