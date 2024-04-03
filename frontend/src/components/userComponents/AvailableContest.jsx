import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Image, Heading, Text, ButtonGroup, Stack, Button, useDisclosure } from '@chakra-ui/react';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import CreateContestModal from '../../components/modal/userModal/CreateContestModal';
import axios from '../../API/axios/axiosInstance.js';
import ParticipateContestModal from '../modal/userModal/ParticipateContestModal.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const AvailableContest = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userId, setUserId] = useState("")
    const [Contest, setContest] = useState(null);
    const { isOpen: isParticipateContestModalOpen, onOpen: onParticipateContestModalOpen, onClose: onParticipateContestModalClose } = useDisclosure();
    const [singleContest, setsingleContest] = useState(null)
    const fetchData = async () => {
        try {
            const { data } = await axios.get("api/user/Contest/");
            setContest(data);
        } catch (err) {
            console.log(err);
        }
    };

    const navigate=useNavigate()

    const { userInfo } = useSelector((state) => { return state.auth });

    useEffect(() => {
        setUserId(userInfo._id)
        fetchData();
    }, []);

    const handleEnterNow = async (id) => {
        try {
            await setsingleContest(id)
            onParticipateContestModalOpen()
        } catch (err) {
            console.log(err);
        }
    }

    const handleContestClick = async (contestId)=>{
        try {
            navigate(`/Contests-view/${contestId}`);
          } catch (error) {
            console.log(error)
          }
    }

    return (
        <div>
            <div className='flex justify-end mr-5'>
                <Button onClick={onOpen} leftIcon={<MdOutlineAddCircleOutline />} colorScheme='yellow' >Create Contest</Button>
            </div>
            <div className='flex flex-row flex-wrap'>
                {Contest && Contest.map(contest => (
                    <Card key={contest._id} maxW='sm' shadow={"lg"} marginLeft="20" marginTop={6}>
                        <CardBody>
                            <Image className='cursor-pointer'
                                src={contest.coverPhoto}
                                alt='Contest Cover Photo'
                                borderRadius='sm'
                                onClick={()=>handleContestClick(contest._id)}
                            />
                            <Stack mt='6' spacing='3'>
                                <Heading onClick={()=>handleContestClick(contest._id)} className='text-center cursor-pointer hover:text-blue-700' size='md'>{contest.contestName}</Heading>
                                <Text>{contest.contestDescription}</Text>
                                <Text>Expiry Date: {new Date(contest.expiryDate).toLocaleDateString()}</Text>
                                <Text>Status: {contest.isActive ? "Active" : "Inactive"}</Text>
                            </Stack>
                        </CardBody>
                        <CardFooter>
                            <ButtonGroup spacing='2'>
                                {contest.createdBy._id === userId ? (
                                    <p className='text-red-600'>Cannot Join, You Made this Contest</p>
                                ) : (
                                    contest.participants.includes(userId) ? (
                                        <p className='text-green-600'>Already Joined</p>
                                    ) : (
                                        <Button onClick={() => handleEnterNow(contest._id)} colorScheme='teal' borderColor='green.500' border='2px' variant='outline'>
                                            Enter Now
                                        </Button>
                                    )
                                )}
                            </ButtonGroup>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <CreateContestModal fetchData={fetchData} isOpen={isOpen} onClose={onClose} />
            <ParticipateContestModal fetchData={fetchData} singleContestid={singleContest} isOpen={isParticipateContestModalOpen} onClose={onParticipateContestModalClose} />
        </div>
    );
};

export default AvailableContest;
