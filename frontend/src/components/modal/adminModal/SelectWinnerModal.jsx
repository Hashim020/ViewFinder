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
import Swal from 'sweetalert2';
import '../../../../node_modules/sweetalert2/dist/sweetalert2.css'

const SelectWinnerModal = ({ isOpen, onClose, singleContest }) => {
    const [contest, setContest] = useState({});
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [err, seterr] = useState("")

    useEffect(() => {
        setContest(singleContest);
        console.log(singleContest);
    }, [isOpen]);

    const handleImageClick = (postId) => {
        setSelectedPhoto(postId);
    };
    const handleSelectWinner = async () => {
        if (!selectedPhoto) {
            return seterr("Please Select one photo");
        }
        onClose()
        Swal.fire({
            title: "Are you sure?",
            text: "Make Sure You Selected the right one",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            beforeOpen: (toast) => {
                toast.instance.style.zIndex = 1020;
            },
        }).then(async (willSelect) => {
            if (willSelect.isConfirmed) {
                try {
                    seterr("");
                    const { data } = await axios.put('/api/admin/chooseContest-winner', {
                        postId: selectedPhoto,
                        contestId: contest._id
                    });
                    if (data.success === "true") {
                        Swal.fire({
                            title: "Done",
                            text: "Acction Applied!!",
                            icon: "success"
                        });
                    }
                } catch (error) {
                    console.error("Error selecting winner:", error);
                }
            } else {
                console.log("User cancelled the selection.");
            }
        });
    };

    const handleClose = async () => {
        try {
            setSelectedPhoto(null);
            seterr("");
            onClose()
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Modal zIndex={1010} size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay zIndex={1010} />
                <ModalContent>
                    <ModalHeader className='text-center'>Select One Photo and choose as winner</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {contest && contest.participation && contest.participation.length === 0 ? (
                            <div className="text-center text-lg text-red-600">No One Participated</div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 overflow-y-scroll">
                                {contest && contest.participation && contest.participation.map(post => (
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
                        <p className='text-red-500 pr-2'>{err}</p>
                        <Button marginRight={4} onClick={handleSelectWinner}>Proceed</Button>
                        <Button colorScheme='blue' mr={3} onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SelectWinnerModal;
