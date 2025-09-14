import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [text, setText] = React.useState('');
    const { userId } = useAuth();
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:3000/api/create-new-chat', {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ text: text, userId: userId })
        })
        const chatId= await res.json();
        navigate(`/dashboard/chat/${chatId}`)
    }
    return (
        <div className='DashboardPage h-full flex flex-col items-center'>
            <div className='text flex-1 flex flex-col items-center justify-center w-1/2 gap-[50px]'>
                <div className='logo flex items-center gap-[20px] opacity-25'>
                    <img className='w-[64px] h-[64px]' src="/logo.png" alt="" />
                    <h1 className='text-[64px] bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent'>Chat AI</h1>
                </div>
                <div className="options w-full flex items-center justify-between gap-[50px]">
                    <div className="option flex-1 flex flex-col gap-[10px] font-semibold text-[14px] p-[20px] border border-[#555] rounded-[20px]">
                        <img className='w-[40px] h-[40px] object-cover' src="/chat.png" alt="" />
                        <span>Create a New Chat</span>
                    </div>
                    <div className="option flex-1 flex flex-col gap-[10px] font-semibold text-[14px] p-[20px] border border-[#555] rounded-[20px]">
                        <img className='w-[40px] h-[40px] object-cover' src="/image.png" alt="" />
                        <span>Analyse Images</span>
                    </div>
                    <div className="option flex-1 flex flex-col gap-[10px] font-semibold text-[14px] p-[20px] border border-[#555] rounded-[20px]">
                        <img className='w-[40px] h-[40px] object-cover' src="/code.png" alt="" />
                        <span>Help me with my Code</span>
                    </div>
                </div>
            </div>
            <div className='form_Container mt-auto w-1/2 bg-[#2c2937] rounded-[20px] flex'>
                <form onSubmit={handleSubmit} action="" className='w-full h-full flex items-center justify-between gap-[20px] mb-[10px]'>
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        type="text" name="text" placeholder="Ask me anything..."
                        className='flex-1 p-[20px] bg-transparent border-none outline-none text-[#ececec]'
                    />
                    <button
                        type='submit'
                        className='bg-[#605e68] rounded-full border-none cursor-pointer p-[10px] flex items-center justify-center mr-[20px]'
                    >
                        <img className='w-[16px] h-[16px]' src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DashboardPage;