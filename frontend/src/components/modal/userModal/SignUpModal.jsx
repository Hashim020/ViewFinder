import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Button,
    FormLabel,
    Input,
    Select,
    Stack,
} from '@chakra-ui/react';

const SignUpModal = ({ isOpen, onClose, handleSignUp }) => {
    const [gender, setGender] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

    const handleSubmit = () => {
        if (!gender || !birthdate || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        if (!password.match(passwordRegex)) {
            setError("Password must have at least one lowercase, one uppercase, one digit, one special character, and be at least 6 characters long");
            return;
        }
        const userData = {
            gender,
            birthdate,
            password,
            confirmPassword
        };
        handleSignUp(userData);
        setError("");
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                    placeholder="Select gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Date of Birth</FormLabel>
                                <Input
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]} 
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </FormControl>
                        </Stack>
                        {error && (
                            <p className="text-red-500 mt-2">{error}</p>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            SignUp
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SignUpModal;
