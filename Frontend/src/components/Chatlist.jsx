import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Chatlist = () => {
    const { userId } = useAuth();
    const [userChatList,setUserchatList]=useState([])
    const path = useLocation().pathname;
    const chatId = path.split('/').pop();
    useEffect(() => {
        const fetchUserList = async () => {
            try {
               const res = await fetch(`http://localhost:3000/api/ai-chats-history-list?userId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                const data = await res.json();
                // console.log(data);
                setUserchatList(data.userList);
            } catch (err) {
                console.error("Error fetching user list:", err);
            }
        };

        if (userId) {
            fetchUserList();
        }
        console.log(userChatList);
    }, [userId,chatId]);
    return (
        <div className='Chatlist flex flex-col h-full'>
            <span className='font-bold text-sm mb-[10px]'>Dashboard</span>
            <Link className='p-2 rounded-[10px] hover:bg-[#2c2937]' to="/dashboard">New Chat</Link>
            <Link className='p-2 rounded-[10px] hover:bg-[#2c2937]' to="/">Explore Chat AI</Link>
            <Link className='p-2 rounded-[10px] hover:bg-[#2c2937]' to="/">Contact</Link>
            <hr className='border-none h-[3px] w-full bg-[#fde9e9] opacity-5 rounded-[5px]  my-2' />
            <span className='font-bold text-sm mb-[10px]'>Chat History</span>
            <div className='list_History flex flex-col overflow-scroll'>
                 {
                    ///have to add loading... here also also for error
                    userChatList?.map((list)=>{
                        return <Link
                        to={`/dashboard/chat/${list._id}`} 
                        key={list._id} className={`p-2 rounded-[10px] hover:bg-[#2c2937] ${chatId === list._id ? "bg-[#2c2937]" : ""}`}>{list.title}</Link>
                    })
                 }
            </div>
        </div>
    )
}

export default Chatlist;