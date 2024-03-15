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

function FollowersModal({ isOpen, onClose, followers }) {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Followers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {followers.map((follower) => (
              <div key={follower.id}>
                <p>Name: {follower.name}</p>
                <p>Username: {follower.username}</p>
                <p>Profile Image URL: {follower.profileImageUrl}</p>
              </div>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FollowersModal;
