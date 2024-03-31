import React from 'react'
import { Card, CardBody, CardFooter, Image, Heading, Text, ButtonGroup, Stack, Divider, Button, useDisclosure } from '@chakra-ui/react'
import { MdOutlineAddCircleOutline } from "react-icons/md";
import CreateContestModal from '../../components/modal/userModal/CreateContestModal';


const AvailableContest = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <div>
            <div className='flex justify-end mr-5'>

                <Button onClick={onOpen} leftIcon={<MdOutlineAddCircleOutline />} colorScheme='yellow' >Create Contest</Button>
            </div>
            <div className='flex flex-row flex-wrap'>

                <Card maxW='sm' shadow={"lg"} marginLeft="20" marginTop={6}>
                    <CardBody>
                        <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='sm'
                        />
                        <Stack mt='6' spacing='3'>
                            <Heading className='text-center' size='md'>Living room Sofa</Heading>
                            <Text>
                                This sofa is perfect for modern tropical spaces, baroque inspired
                                spaces, earthy toned spaces and for people who love a chic design with a
                                sprinkle of vintage design.
                            </Text>
                        </Stack>
                    </CardBody>
                    <CardFooter>
                        <ButtonGroup spacing='2'>
                            <Button colorScheme='teal' borderColor='green.500' border='2px' variant='outline'>
                                Enter Now
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                </Card>  
            </div>
            <CreateContestModal isOpen={isOpen} onClose={onClose}  />
        </div>


    )
}

export default AvailableContest