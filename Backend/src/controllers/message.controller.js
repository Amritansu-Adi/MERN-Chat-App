import Users from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await Users.find({_id : {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
};

export const getMessages = async (req, res) => {
    try{
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[                                                           //find all messages where sender and reciever are these two users
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
};

export const sendMessage = async (req, res) => {
    try{
        const {text, image} = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        let imageUrl;
        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        const recieverSocketId = getRecieverSocketId(receiverId); // get the socket id of the reciever
        console.log("Receiver Socket ID:", recieverSocketId); // Debugging line

        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", {     // emit the message to the reciever only
                newMessage,
            });
        }

        await newMessage.save();

        //realtime functionality to emit the message to the reciever
        

        res.status(200).json(newMessage);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};