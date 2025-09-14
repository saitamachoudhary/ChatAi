import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
import ImageKit from 'imagekit';
import cors from 'cors';
import { AI } from './Ai/Ai.js';
import mongoose from 'mongoose';
// import { task } from './models/task.js';
import chat from './models/chat.js';
import userChats from './models/userChats.js';
// import { clerkClient, requireAuth, getAuth } from '@clerk/express';
import {sendEmail}  from './Email/email.js';

const imagekit = new ImageKit({
  urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
  publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY
});

const connectMongoDB = async () => {
  mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
}

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());


app.get('/api/upload', (req, res) => {
  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  res.send({ token, expire, signature, publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY });
})

app.post('/api/create-new-chat', async (req, res) => {
  const { text, userId } = req.body;
  try {
    //Create a new chat
    const newChat = new chat({
      userId: userId,
      history: [
        { role: "user", parts: [{ text }] }
      ]
    })

    const saveChat = await newChat.save();

    //check if user has a chat history
    const userChat = await userChats.find({ userId: userId });

    //if user chat does not exist, create a new one

    if (!userChat.length) {
      const newUserChat = new userChats({
        userId: userId,
        chats: [
          {
            _id: saveChat._id,
            title: text.substring(0, 40),
          },
        ]
      })
      await newUserChat.save();
    } else {
      //if exist push the chat to the existing array
      await userChats.updateOne({ userId: userId }, {
        $push: {
          chats: {
            _id: saveChat._id,
            title: text.substring(0, 40),
          }
        }
      })
    }
    res.status(201).send(newChat._id);
  } catch (error) {

  }
})

app.get('/api/ai-chats-history-list', async (req, res) => {
  const { userId } = req.query;
  try {
    const userChatslist = await userChats.findOne({ userId: userId });
    res.json({ userList: userChatslist.chats })
  } catch (error) {
    res.json({msg:"User does not exist",
      error: error.message
    })
  }
})

app.get('/api/ai-chats-history/:id', async (req, res) => {
  const { userId } = req.query;
  try {
    const userChatsHistory = await chat.findOne({ _id: req.params.id, userId });
    res.json({ userChatHistory: userChatsHistory })
  } catch (error) {

  }
})

app.put('/api/ai-chats-history/:id', async (req, res) => {
  const { userId } = req.query;
  const { question, answer } = req.body
  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }] }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const userChat = await chat.updateOne({ _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          }
        }
      }
    );
    res.json({ updatedChats: userChat })

  } catch (error) {

  }
})

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ message: 'All fields are required!' });
    return;
  }

  const Ai_response = await AI(message);
  // console.log(Ai_response);
  res.json({ message: Ai_response });
})

app.post('/api/sendEmail',async(req,res)=>{
   const {task,emailAddress}=req.body;
   try {
    const emailResponse = await sendEmail(task,emailAddress);
    console.log(emailResponse);
   } catch (error) {
    
   }
})

// const Ai_response = await AI("Explain how AI works in a few words");
// console.log(Ai_response.candidates[0].content.parts[0].text);

app.listen(port, () => {
  connectMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
})