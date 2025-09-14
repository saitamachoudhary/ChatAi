import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Homepage = () => {
    return (
        <div className='homepage flex items-center justify-center h-screen gap-[100px]'>
            <img src="/orbital.png" alt="" className="absolute bottom-0 top-0 opacity-10 z-0 orbital" />
            <div className='left flex-1 flex flex-col items-center justify-center gap-[16px] z-10'>
                <h1 className='text-8xl bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent font-bold' 
                    // style={{WebkitBackgroundClip: "text"}}
                    >CHAT AI</h1>
                <h2 className='font-bold text-lg'>Supercharge your creativity and productivity</h2>
                <h3 className='text-center text-base'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint
                    dolorem doloribus, architecto dolor.
                </h3>
                <Link to="/dashboard" className='px-[25px] py-[15px] bg-sky-600 text-white rounded-full text-base font-semibold hover:bg-sky-700'>Get Started</Link>
            </div>
            <div className='right flex-1 flex items-center justify-center relative'>
                <div className="imgContainer flex items-center justify-center overflow-hidden bg-[#140e2d] rounded-[50px] relative h-96 w-full">
                    <div className="bgContainer h-full w-full overflow-hidden absolute top-0 left-0 rounded-[50px]">
                        <div className="bg">

                        </div>
                    </div>
                    <img src="/bot.png" alt="" className='object-contain h-full w-full botImg'/>
                </div>
            </div>
        </div>
    )
}

export default Homepage;