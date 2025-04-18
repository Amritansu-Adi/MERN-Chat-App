import mongoose from 'mongoose';

const userSchea = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePic: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchea);

export default User;