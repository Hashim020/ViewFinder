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

function LikedUsersModal({ isOpen, onClose, likedUsers }) {

  return (
    <>

      <Modal

        motionPreset='slideInBottom'
        isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropBlur='2px' />
        <ModalContent>
          <ModalHeader><p className='text-base text-center'>likes</p></ModalHeader>
          <ModalCloseButton />
          <ModalBody
          >
            
            {likedUsers.map((lu) => (
              <>
                <div className='flex' key={lu._id}>
                  {lu.profileImageUrl ? (

                    <img src={lu.profileImageUrl} alt="profile pix" className="w-10 h-10 rounded-full" />
                  ) : (

                    <img src={blankProfileImg} alt="profile pix" className="w-10 h-10 rounded-full" />
                  )}
                  <p className='font-bold -mt-1 ml-1' >{lu.username}</p>
                </div>
                <p className=' ml-[45px] text-gray-400 -mt-6'>{lu.name}</p>
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

export default LikedUsersModal;
