import React, { useState } from 'react';
import { Modal, Flex, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Text } from '@chakra-ui/react';
import { useAdminLogoutMutation } from '../../../Slices/adminApiSlice';
import { Logout } from '../../../Slices/adminAuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';





function SidBarModal({ overlayOneContent }) {
    const dispatch=useDispatch();
    const navigate= useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = useState(overlayOneContent);
    const [Logout,isLoading]=useAdminLogoutMutation()


    
    async function handleLogout (){
        try {
            await Logout().unwrap();
            dispatch(Logout());
            navigate('/admin')
          } catch (error) {
            console.log(error);
            
          }
    }



    return (
        <>
            <Button
                className="bg-blue-500 text-white"
                onClick={() => {
                    setOverlay(overlayOneContent);
                    onOpen();
                }}
            >
                More
            </Button>
            <Modal size='xs' marginTop='-1000' motionPreset='slideInBottom' isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent marginTop='370' marginStart='-1010px'>
                    <ModalHeader><p className='text-base text-center'>More Actions</p></ModalHeader>
                    <hr />
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex justifyContent='flex-start'>
                            <p onClick={handleLogout} className='text-red-800 cursor-pointer hover:shadow-lg hover:shadow-red-800 rounded'>Logout</p>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>    
        </>
    );
}

export default SidBarModal;
