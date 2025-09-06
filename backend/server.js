import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route.js";
import { vehicleRouter } from "./routes/vehicle.route.js";
import { fineRouter } from "./routes/fine.route.js";
import { tollRouter } from "./routes/toll.route.js";
import { transactionRouter } from "./routes/transaction.route.js";
import { trackingRouter } from "./routes/tracking.route.js";
import { congestionRouter } from "./routes/congestion.route.js";
import trackingSocket from "./sockets/tracking.socket.js";
import { Server } from "socket.io";
import http from "http";
dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/users",authRouter);
app.use("/api/vehicles",vehicleRouter);
app.use("/api/tolls",tollRouter);
app.use("/api/fines",fineRouter);
app.use("/api/transactions",transactionRouter);
app.use("/api/trackings",trackingRouter);
app.use("/api/congestion",congestionRouter);


const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin:"http://localhost:5173", //your frontend URL
        methods:["GET","POST","PUT","PATCH","DELETE"]
    }
})

trackingSocket(io);

const startServer = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the Database successfully ✅");
        app.listen(port,() => {
            console.log(`Server is running on port ${port} 🚀`);
        })
    } catch(error) {
        console.log("Error in Starting the Server");
        process.exit(1);
    }
}

startServer();