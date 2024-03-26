import React from 'react'
import SideBar from '../../components/userComponents/SideBar'

const Contests = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
                <SideBar />
            </div>

            <div className='ml-10'>
                <div className="flex justify-center items-center mt-24">
                    <h1 className="text-5xl text-center font-mono">Share your photos and be rewarded 🥳</h1>
                </div>
            </div>
        </div>)
}

export default Contests