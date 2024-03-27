import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const SearchLoading = () => {
    return (
        <Stack>
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            <Skeleton speed={0.1} borderRadius="xl" height='40px' />
            
        </Stack>
    )
}

export default SearchLoading