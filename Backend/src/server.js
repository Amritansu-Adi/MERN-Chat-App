import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();


const app = express()

const PORT = process.env.PORT

// Middleware to parse JSON request bodies with increased size limit
app.use(express.json({ limit: '10mb' })); // Increase the limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // For URL-encoded data

app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB()
})