import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connettionInstances = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connettionInstances.connection.host}`);

    } catch (error) {
        console.log("MongoDB Connection ERROR: ", error);
        process.exit(1)
    }
}

export default connectDB
