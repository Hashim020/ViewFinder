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
} from '@chakra-ui/react';
import axios from 'axios';

const ReportsModal = ({ isOpen, onClose, postId }) => {
    const [reports, setReports] = useState([]);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`/api/admin/posts-reports/${postId}`);
            console.log(data);
            setReports(data.reports);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [postId]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reports</ModalHeader>
                    <hr />
                    <ModalCloseButton />
                    <ModalBody>
                        {reports.map((report) => (
                            <div key={report._id} className='flex'>
                                <p><strong>Reason:</strong> {report.reason}</p>
                                <p><strong>Reported By:</strong> {report.userId.username}</p>
                                <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </ModalBody>
                
                </ModalContent>
            </Modal>
        </>
    );
};

export default ReportsModal;
