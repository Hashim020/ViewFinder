import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Image,
    Checkbox,
} from '@chakra-ui/react';
import axios from '../../../API/axios/axiosInstance.js';
import Swal from 'sweetalert2'
const ParticipateContestModal = ({ isOpen, onClose, singleContestid ,fetchData}) => {
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const getUserPosts = async () => {
        try {
            const response = await axios.get('/api/user/getuser-post');
            setUserPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            getUserPosts();
        }
    }, [isOpen]);

    const handleImageClick = (postId) => {
        setSelectedPhoto(postId);
    };

    const handleParticipation = async () => {
        console.log(selectedPhoto, singleContestid);
        try {
            const response = await axios.put('/api/user/Contest/participate', {
                postId: selectedPhoto,
                contestId: singleContestid
            });
            const { data } = response;
            if (data.sucess = "True") {
                Swal.fire({
                    title: "Good job!",
                    text: "Shutter Success! Thanks for Participating!",
                    icon: "success"
                });
                onClose()
                fetchData()
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className='text-center'>Select One Photo and Proceed</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {userPosts.length === 0 ? (
                            <div className="text-center text-lg text-red-600">Please Create a post and select.</div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 overflow-y-scroll">
                                {userPosts.map(post => (
                                    <div key={post._id}>
                                        <Image
                                            src={post.image.url}
                                            alt={`Post ${post._id}`}
                                            cursor="pointer"
                                            onClick={() => handleImageClick(post._id)}
                                        />
                                        {selectedPhoto === post._id && <Checkbox isChecked />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button marginRight={4} onClick={handleParticipation} >Proceed</Button>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    );
};

export default ParticipateContestModal;
