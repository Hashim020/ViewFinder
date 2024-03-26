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

function FollowingsModal({ isOpen, onClose, followings }) {

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
          <ModalHeader><p className='text-base'>Followings</p></ModalHeader>
          <ModalCloseButton />
          <ModalBody
          >
            {followings.map((following) => (
              <>
                <div className='flex' key={following.id}>
                  {following.profileImageUrl ? (

                    <img src={following.profileImageUrl} alt="profile pix" className="w-10 h-10 rounded-full" />
                  ) : (

                    <img src={blankProfileImg} alt="profile pix" className="w-10 h-10 rounded-full" />
                  )}
                  <p className='font-bold -mt-1 ml-1' >{following.username}</p>
                </div>
                <p className=' ml-[45px] text-gray-400 -mt-6'>{following.name}</p>
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

export default FollowingsModal;
