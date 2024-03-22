import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack>
        <Skeleton speed={0.1}borderRadius="xl"  height='70px' />
        <Skeleton speed={0.1}borderRadius="xl"  height='70px' />
        <Skeleton speed={0.1}borderRadius="xl"  height='70px' />
        <Skeleton speed={0.1}borderRadius="xl"  height='70px' />
        <Skeleton speed={0.1}borderRadius="xl"  height='70px' />
        <Skeleton speed={0.1}borderRadius="xl"  height='70px' />
    </Stack>
  )
}

export default ChatLoading