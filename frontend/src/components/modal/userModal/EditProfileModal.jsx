import React, { useState } from 'react';
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
        name: userDATA.name,
        dateOfBirth: userDATA.dateOfBirth,
        gender: userDATA.gender
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const { name, dateOfBirth, gender } = userData;
            const response = await updateUserProfile({ name, dateOfBirth, gender });
            const resp=response.data
            if(resp.success=="true"){
                toast.success("Udated Successfully")
            }
            console.log(response.data); // Log the response from the backend
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating profile:', error);
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
                            <Input type="date" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleChange} />
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
        </>
    );
}

export default EditProfileModal;
