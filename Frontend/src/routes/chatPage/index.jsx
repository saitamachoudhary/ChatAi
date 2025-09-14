import React from 'react';
import './styles.css';
import NewPrompt from '../../components/NewPrompt/index';
import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // theme for code
import TaskList from '../../components/TaskList';
import Timeline from '../../components/Timeline';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();
    const path = useLocation().pathname;
    const chatId = path.split('/').pop();

    const { user } = useUser();
    const emailAddress = user.emailAddresses[0].emailAddress;
    const saveMessageToDb = async (assistantMessage) => {
        await fetch(`http://localhost:3000/api/ai-chats-history/${chatId}?userId=${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: input,
                answer: assistantMessage
            }),
        });
    }

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;
        const userMessage = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const assistantMessage = await callServer(input);
            setMessages((prev) => [...prev, { role: "assistant", text: assistantMessage }]);
            saveMessageToDb(assistantMessage);
        } catch (err) {
            setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Error fetching response." }]);
        } finally {
            setLoading(false);
        }
    }

    const callServer = async (inputText) => {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ message: inputText })
        });

        if (!response.ok) {
            throw new Error("Error generating the response.");
        }

        const result = await response.json();
        return result.message;
    }

    const handleKeyUp = async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSubmit();
        }
    };

    const fetchUserChatList = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/ai-chats-history/${chatId}?userId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            let newMessages = [];
            const data = await res.json();
            data?.userChatHistory?.history?.forEach(element => {
                if (element.role === "user") {
                    element.parts.forEach(ele => {
                        // setMessages(prev => [...prev, { role: "user", text: ele.text }])
                        newMessages.push({ role: "user", text: ele.text });
                    })
                }
                else if (element.role === "model") {
                    element.parts.forEach(ele => {
                        newMessages.push({ role: "assistant", text: ele.text });
                    })
                }
                else {
                    //do nothing
                }
            });
            setMessages(newMessages);
        } catch (err) {
            console.error("Error fetching user list:", err);
        }
    };

    const notifyUser = async (task) => {
        const response = await fetch("http://localhost:3000/api/sendEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ task, emailAddress }),
        });
        // const data = await response.json();
        // console.log(task);
    }

    useEffect(() => {
        if (userId && chatId) {
            fetchUserChatList();
            if (messages.length === 1 && messages[0].role === "user") {
                (async () => {
                    setLoading(true);
                    try {
                        const assistantMessage = await callServer(messages[0].text);
                        setMessages((prev) => [...prev, { role: "assistant", text: assistantMessage }]);
                        saveMessageToDb(assistantMessage);
                    } catch (error) {
                        setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Error fetching response." }]);
                    } finally {
                        setLoading(false);
                    }

                })();
            }
        }
    }, [userId, chatId, messages[0]?.text]);

    return (
        <div className='ChatPage h-full flex flex-col items-center relative'>
            <div className="Wrapper flex-1 overflow-scroll w-full flex justify-center">
                <div className="chat w-2/3 flex flex-col gap-[20px]">
                    {
                        messages.map((mesg, index) => {
                            if (mesg.role === "user") {
                                // User message → just Markdown
                                return (
                                    <div key={index} className="message user">
                                        <Markdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeHighlight]}
                                        >
                                            {mesg.text}
                                        </Markdown>
                                    </div>
                                );
                            } else {
                                let tasks = [];
                                let cleanText = mesg.text;

                                try {
                                    const match = mesg.text.match(/```json([\s\S]*?)```/);
                                    if (match) {
                                        const parsed = JSON.parse(match[1]);
                                        tasks = Array.isArray(parsed) ? parsed : [parsed];
                                        cleanText = mesg.text.replace(match[0], "");
                                    }
                                } catch (e) {
                                    console.error("Failed to parse JSON:", e);
                                }

                                return (
                                    <div key={index} className="message message_formate">
                                        {/* 1. Render Markdown WITHOUT the JSON block */}
                                        <Markdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeHighlight]}
                                        >
                                            {cleanText.trim()}
                                        </Markdown>

                                        {/* 2. Show structured tasks */}
                                        {tasks.length > 0 &&
                                            <div>
                                                <TaskList tasks={tasks} key={index} />
                                                <div className="py-3 flex items-center gap-3">
                                                    Want to get notified about this task?
                                                    <button
                                                        onClick={() => notifyUser(tasks[0])}
                                                        className="bg-[#3c3a42] hover:bg-[#2c2937] cursor-pointer text-white text-xs font-semibold py-2 px-2 rounded">Notify</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                );
                            }
                        })
                    }
                    {loading && <div className='message animate-pulse'>Loading...</div>}
                    <NewPrompt messages={messages} input={input} setInput={setInput} handleSubmit={handleSubmit} handleKeyUp={handleKeyUp} />
                </div>
            </div>
        </div>
    )
}

export default ChatPage;