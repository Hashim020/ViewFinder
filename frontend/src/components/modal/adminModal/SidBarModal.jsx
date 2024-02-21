import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Text } from '@chakra-ui/react';

function SidBarModal({ overlayOneContent }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = useState(overlayOneContent);

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
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Custom backdrop filters!</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default SidBarModal;
