import mongoose from 'mongoose';
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Connection Error", error);
        process.exit(1)
    }
}


export default connectDB