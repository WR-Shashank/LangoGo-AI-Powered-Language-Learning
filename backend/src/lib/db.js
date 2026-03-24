import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        // `conn.connection.host` gives the host name of the MongoDB server
    }
    catch(err){
        console.log('Error connecting to MongoDB:', err);
        process.exit(1); // iska mtlb process is terminated with an error
    }
}