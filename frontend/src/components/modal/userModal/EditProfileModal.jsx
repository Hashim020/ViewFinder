import React, { useState, useEffect } from 'react';
import { useUpdateUserProfileMutation } from '../../../Slices/userApiSlice';
import { toast } from 'react-toastify';
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
    Select
} from '@chakra-ui/react';

const EditProfileModal = ({ isOpen, onClose, userDATA }) => {

    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
    const [userData, setUserData] = useState({
        name: '',
        dateOfBirth: '',
        gender: ''
    });

    useEffect(() => {
        if (userDATA) {
            const formattedDateOfBirth = userDATA.birthdate ? userDATA.birthdate.split('T')[0] : ''; // Extract date part
            setUserData({
                name: userDATA.name || '',
                dateOfBirth: formattedDateOfBirth,
                gender: userDATA.gender || ''
            });
        }
    }, [userDATA]);
    console.log(userData);
    
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const { name, dateOfBirth, gender } = userData;
            const formattedDateOfBirth = userDATA.birthdate ? userDATA.birthdate.split('T')[0] : '';
            console.log("new: " + dateOfBirth + ", old: " + formattedDateOfBirth);
            if (
                name === userDATA.name &&
                dateOfBirth === formattedDateOfBirth && // Compare with formatted dateOfBirth
                gender === userDATA.gender
            ) {
                toast.info("No changes to save");
                onClose(); // Close the modal without saving
                return;
            }
    
            if (!name || !dateOfBirth || !gender) {
                toast.error("Please fill out all fields");
                return;
            }
    
            const response = await updateUserProfile({ name, dateOfBirth, gender });
            const resp = response.data;
            if (resp.success === "true") {
                toast.success("Updated Successfully");
                onClose(); // Close the modal after successful update
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Error updating profile");
        }
    };

    return (
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
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost' onClick={handleSave} isLoading={isLoading}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditProfileModal;
