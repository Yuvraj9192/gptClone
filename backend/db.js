import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.mongo_url);
        console.log("connected to DB");
    }catch(error){
        console.log("something went wrong while connecting to db");
    }
}

connectDB();

export default connectDB;