import Users from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

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
                {senderId:myId, recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId}
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
        const { id:recieverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //todo: realtime functionality to emit the message to the reciever

        res.status(200).json(newMessage);
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
};