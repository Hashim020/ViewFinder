import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { REASONFORREPORTING } from '../../../constants/constants';
import { FaGreaterThan } from "react-icons/fa6";
import axios from '../../../API/axios/axiosInstance.js'
import Swal from "sweetalert2"
const ReportPostMadal = ({ isOpen, onClose, postId,PostViewModalonclose }) => {
    const [reasons, setReasons] = useState([]);

    useEffect(() => {
        setReasons(REASONFORREPORTING);
    }, []);

    const handleClick = async (reason) => {
        try {
            const response = await axios.put('/api/user/post-report', {
                reason,
                postId
            });
            console.log(response.data);
            onClose()
            PostViewModalonclose()
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "post Reported",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.log(error);
            onClose()
            PostViewModalonclose()
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
              });
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><p className='text-center text-base font-bold'>Report</p></ModalHeader>
                    <hr />
                    <ModalCloseButton />
                    <ModalBody>
                        <p className='font-bold'>Why are you reporting this post?</p>
                        {reasons.map((r, index) => (
                            <div className='flex justify-between pb-3 cursor-pointer' onClick={() => handleClick(r)} key={index}>
                                <p>{r}</p>
                                <div className='mt-[6px]'>
                                    <FaGreaterThan />
                                </div>
                            </div>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        {/* Add footer content here if needed */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ReportPostMadal;
