import React, { useEffect } from 'react'
import SideBar from '../../components/userComponents/SideBar'
import Aos from 'aos';
import AvailableContest from '../../components/userComponents/AvailableContest';
const Contests = () => {
    useEffect(() => {
        Aos.init()

    }, [])
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
                <SideBar />
            </div>

            <div data-aos="fade-right" className='ml-1'>
                <div style={{ backgroundImage: `url("https://source.unsplash.com/random/1600x900")` }} className="justify-center items-center w-[1095px] h-[400px] relative">
                    <div className='absolute top-[40%] left-14 transform translate[-50%,-50%]'>
                        <h1 className="text-4xl ml-[139px] font-semibold font-mono text-white">Share your photos and be rewarded 🥳</h1>
                        <p className='w-[800px] text-center ml-[101px] text-white '>Enter now to win great prizes and your work seen around the world. Get inspired and join thousands sharing their passion for photography.</p>
                    </div>
                </div>
                <AvailableContest/>
            </div>
        </div>)
}

export default Contests