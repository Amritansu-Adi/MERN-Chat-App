import bycrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import claudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try{
        if (password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }


        //checking if user alredy exist in DB
        const user = await User.findOne({email});
        if (user){
            return res.status(400).json({message: "User already exists"});
        }

        //hashing the password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        //creating new user and saving in DB
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser){
            // GENERATING jwt TOKEN FOR auth and session tracking
            const token = generateToken(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                
            });
        }
        else{
            res.status(400).json({message: "User not created"});
        }
    
    } catch (error) {
        console.error("Error in signup:", error);

        res.status(500).json({message: "Internal server error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        //checking if user exist in DB
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message: "Invalid credentials email"});
        }
        else{
            //comparing password
            const isMatch = await bycrypt.compare(password, user.password);
            if (!isMatch){
                return res.status(400).json({message: "Invalid credentials"});
            }
            else{
                // GENERATING jwt TOKEN FOR auth and session tracking
                const token = generateToken(user._id, res);

                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePic: user.profilePic
                });
        }
    }
    }
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0});      //deleting the jwt cookie
        res.status(200).json({message: "Logged out successfully"});
    }
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({message: "Profile picture is required"});
        }

        const uploadResponse = await claudinary.uploader.upload(profilePic);
        
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}