import path from 'path'
import Express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { updateContestStatus } from './models/contestModel.js'
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoute.js'
import adminRoutes from './routes/adminRoute.js'
import { eventEmitter } from "./config/eventHandler.js";

const port = process.env.PORT || 5000;

const currentWorkingDir = path.resolve('ViewFinder');
const parentDir = path.dirname(currentWorkingDir);



const conectdb= async ()=>{
   await connectDB();
}
dotenv.config();
conectdb()
const app = Express();



app.use(Express.json({ limit: '50mb' }));
app.use(Express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes)


if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(Express.static(path.join(__dirname, "./frontend/dist")));
    
    app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
);

} else {
    
    app.get("/", (req, res) => res.send(""));
}

app.use(notFound);
app.use(errorHandler);

import { Server } from 'socket.io';

const server = app.listen(port, () => console.log(`Server Is Running http://localhost:${port}`));

updateContestStatus()
const socketServer = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

socketServer.on("connection", (socket) => {
    console.log("connected to socket.io");
    
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })
    
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined room" + room);
    })
    
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        
        if (!chat.users) return console.log("chat.users not defined");
        
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
    
    eventEmitter.on('notification', (postData) => {
        socket.emit('notification', postData);
    });
    
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

socketServer.on("error", (error) => {
    console.error("socket.io error:", error);
});

