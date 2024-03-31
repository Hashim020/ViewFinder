import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
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
    Textarea,
    RadioGroup,
    HStack,
    Radio,
    Collapse,
    NumberInput
} from '@chakra-ui/react';
import axios from 'axios';
import { CircularProgress } from '@chakra-ui/react';
const CreateContestModal = ({ isOpen, onClose }) => {
    const [isLoading, setisLoading] = useState(false);
    const [contestName, setContestName] = useState('');
    const [contestDescription, setContestDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [contestType, setContestType] = useState('free');
    const [paidAmount, setPaidAmount] = useState('');
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const imageRef = useRef();
    const cropperRef = useRef();

    const handleCaptionChange = (event) => {
        setContestName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setContestDescription(event.target.value);
    };

    const handlePaidAmountChange = (event) => {
        setPaidAmount(event.target.value);
    };

    const handleDateChange = (e) => {
        const selected = e.target.value;
        const today = new Date().toISOString().split('T')[0];
        if (selected >= today) {
            setSelectedDate(selected);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleCrop = () => {
        if (!cropperRef.current) return;
        const croppedDataUrl = cropperRef.current.getCroppedCanvas().toDataURL();
        setCroppedImage(croppedDataUrl);
    };

    const handleCreateContest = () => {
        if (!contestName || !contestDescription || !croppedImage || !selectedDate) {
            toast.error("Please fill in all fields.");
            return;
        }

        if(contestType === 'paid'){
            if(!paidAmount){
                return toast.error("Please give amount")
            }

            if(paidAmount.length>4){
                return toast.error("Amount is Not Valid,Only 4 Digts allowed")
            }
        }

        setisLoading(true);

        const postData = {
            name: contestName,
            description: contestDescription,
            type: contestType,
            Amount: contestType === 'paid' ? paidAmount : null,
            image: croppedImage,
            expiry:selectedDate
        };

        axios.post('/api/user/Contest/create', postData)
            .then(response => {
                console.log('Contest creation successful' + response);
                toast.success("Contest Created");
                onClose();
            })
            .catch(error => {
                console.error('Error creating contest:', error);
                toast.error("An error occurred while creating contest.");
            })
            .finally(() => {
                setisLoading(false);
            });
    };

    const initCropper = () => {
        if (imageRef.current && !cropperRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 1600 / 900,
                viewMode: 1,
                autoCropArea: 1,
            });
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setContestName('');
            setContestDescription('');
            setPaidAmount('');
            setImage(null);
            setCroppedImage(null);
            if (cropperRef.current) {
                cropperRef.current.destroy();
                cropperRef.current = null;
            }
        }
    }, [isOpen]);

    return (
        <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter="auto" backdropBlur='2px' />
            <ModalContent>
                <ModalHeader>Create a New Contest</ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Contest Name:</FormLabel>
                        <Input maxLength={30} value={contestName} onChange={handleCaptionChange} placeholder="Enter your contest name" />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Contest Description:</FormLabel>
                        <Textarea maxLength={150} value={contestDescription} onChange={handleDescriptionChange} placeholder="Enter your contest description" />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Contest Type:</FormLabel>
                        <RadioGroup defaultValue='free' onChange={(value) => setContestType(value)}>
                            <HStack spacing={4}>
                                <Radio value='free'>Free</Radio>
                                <Radio value='paid'>Paid</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>
                    <Collapse in={contestType === 'paid'} unmountOnExit>
                        <FormControl mt={4}>
                            <FormLabel>Amount (if paid):</FormLabel>
                            <Input type='number'  value={paidAmount} onChange={handlePaidAmountChange} placeholder='Enter amount' />
                        </FormControl>
                    </Collapse>
                    <FormControl mt={4}>
                        <FormLabel>Contest Image:</FormLabel>
                        <Input type="file" onChange={handleImageChange} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Contest Expiry Date:</FormLabel>
                        <Input type="date" onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} value={selectedDate} />
                    </FormControl>
                    {image && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: '100%', maxWidth: '500px' }}>
                                <img ref={imageRef} src={image} alt="Uploaded" onLoad={initCropper} style={{ maxWidth: '100%' }} />
                            </div>
                            <Button mt={3} onClick={handleCrop}>Crop Image</Button>
                        </div>
                    )}
                    {croppedImage && (
                        <div style={{ width: '100%', marginTop: '20px' }}>
                            <p>Cropped Image:</p>
                            <img src={croppedImage} alt="Cropped" />
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    {isLoading ? (
                        <CircularProgress
                            isIndeterminate
                            color="green.500"
                            thickness="4px"
                            size="48px"
                            trackColor="transparent"
                        />
                    ) : (
                        <Button colorScheme='green' mr={3} onClick={handleCreateContest}>
                            Create Contest
                        </Button>
                    )}
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateContestModal;