
import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { toast } from 'react-toastify';
import { CircularProgress } from '@chakra-ui/react';
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
    Input
} from '@chakra-ui/react';
import axios from 'axios';

const CreatePostModal = ({ getUserPosts,fetchData, isOpen, onClose }) => {
    const [isLoading, setisLoading] = useState(false)
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const imageRef = useRef();
    const cropperRef = useRef();

    const handleCaptionChange = (event) => {
        setCaption(event.target.value);
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
        const croppedDataUrl = cropperRef.current.getCroppedCanvas().toDataURL();
        setCroppedImage(croppedDataUrl);
    };

    const handlePost = () => {
        if (!caption || !croppedImage) {
            toast.error("Please fill in all fields.");
            return;
        }

        setisLoading(true);

        const postData = {
            caption: caption,
            image: croppedImage
        };

        axios.post('/api/user/save-post', postData)
            .then(response => {
                console.log('Post successful' + response);
                toast.success("Post Added");
                onClose();
                if(fetchData){
                    fetchData()
                }
                if(getUserPosts){
                    getUserPosts()
                }
            })
            .catch(error => {
                console.error('Error posting:', error);
                toast.error("An error occurred while posting.");
            })
            .finally(() => {
                setisLoading(false);
            });
    };

    const initCropper = () => {
        if (imageRef.current && !cropperRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 4 / 5,
                viewMode: 1,
                autoCropArea: 1,
            });
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setCaption('');
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
                <ModalHeader>Create a New Post</ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Upload Image:</FormLabel>
                        <Input type="file" onChange={handleImageChange} />
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
                    <FormControl mt={4}>
                        <FormLabel>Caption:</FormLabel>
                        <Input value={caption} onChange={handleCaptionChange} placeholder="Enter your caption here" />
                    </FormControl>
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
                        <Button colorScheme='green' mr={3} onClick={handlePost}>
                            Post
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

export default CreatePostModal;