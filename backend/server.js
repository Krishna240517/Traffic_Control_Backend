import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route.js";
import { vehicleRouter } from "./routes/vehicle.route.js";
import { fineRouter } from "./routes/fine.route.js";
import { tollRouter } from "./routes/toll.route.js";
import { transactionRouter } from "./routes/transaction.route.js";
import { trackingRouter } from "./routes/tracking.route.js";
dotenv.config();


const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(cookieParser());

app.use("/api/users",authRouter);
app.use("/api/vehicles",vehicleRouter);
app.use("/api/tolls",tollRouter);
app.use("/api/fines",fineRouter);
app.use("/api/transactions",transactionRouter);
app.use("/api/trackings",trackingRouter);



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