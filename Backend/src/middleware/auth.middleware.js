import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt
        
        if(!token){
            return res.status(401).json({message: "Unauthorized  no token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized  token verification failed (invalid token)"});
        }

        const user = await User.findById(decoded.userId).select("-password");                     //select everything except password

        if(!user){
            return res.status(401).json({message: "Unauthorized  user not found"});
        }

        req.user = user;                            // add user to the request object
        next();                                    // call the next function in the middleware chain (updateProfile)
    }
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}