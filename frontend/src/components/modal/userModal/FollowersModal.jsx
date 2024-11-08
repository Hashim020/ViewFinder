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
import blankProfileImg from '../../../assets/no-profilePicture.png'


function FollowersModal({ isOpen, onClose, followers }) {
  console.log(followers);

  return (
    <>

      <Modal
        motionPreset='slideInBottom'
        isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropInvert='80%'
          backdropBlur='2px' />
        <ModalContent>
          <ModalHeader ><p className='text-base'>Followers</p></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {followers.map((follower) => (
              <>
                <div className='flex' key={follower.id}>
                  {follower.profileImageUrl ? (
                    <img src={follower.profileImageUrl} alt="profile pix" className="w-10 h-10 rounded-full" />
                  ) : (
                    <img src={blankProfileImg} alt="profile pix" className="w-10 h-10 rounded-full" />
                  )}
                  <p className='font-bold -mt-1 ml-1' >{follower.username}</p>
                </div>
                <p className=' ml-[45px] text-gray-400 -mt-6'>{follower.name}</p>
              </>
            ))}
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FollowersModal;
