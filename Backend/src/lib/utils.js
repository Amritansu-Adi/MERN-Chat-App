import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie("jwt", token, {
        httpOnly: true,         // Prevents client side js from reading the cookie
        sameSite: "strict",     // Protects against CSRF attacks
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return token;
}