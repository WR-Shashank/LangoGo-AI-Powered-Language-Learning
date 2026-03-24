import express from 'express';
import dotenv from 'dotenv';// Importing dotenv to manage environment variables
import cookieParser from 'cookie-parser'; // Importing cookie-parser to handle cookies

dotenv.config();// Load environment variables from .env file
import cors from "cors";
import path from "path";

import authRoutes from './routes/auth.route.js'; // Importing the auth routes // we can import by any name we want
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';
import agentRoutes from './routes/agentRoutes.js';
const PORT = process.env.PORT;  // Use PORT from environment variables

const __dirname = path.resolve();

const app =express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true // this will allow frontend to send cookies
}))
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies
app.use(express.json()); // Middleware to parse JSON bodies


app.use("/api/auth",authRoutes); // Use the auth routes under the /api/auth path
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/agent',agentRoutes);

// this means when in the production stage we will serve when above routes are called and if other then these any than our frontend routes will serve
if(process.env.NODE_ENV === "production"){
    app.use((express.static(path.join(__dirname, "../frontend/dist"))));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Connect to the database when the server starts
})