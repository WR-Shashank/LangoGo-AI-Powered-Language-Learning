import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apikey = process.env.STREAM_API_KEY;
const apisecret = process.env.STREAM_SECRET_KEY;

if(!apikey || !apisecret) {
    console.log('STREAM_API_KEY and STREAM_SECRET_KEY missing in .env file');
}

const streamClient = StreamChat.getInstance(apikey, apisecret); // beacause of the streamClient we can communicate with stream application

export const upsertStreamUser = async (userData)=>{

    try{
        await streamClient.upsertUsers([userData]); // upsertUser is used to create or update a user in Stream
        return userData; 
    }
    catch(err){
        console.error('Error creating Stream user:', err);
    }
}

export const generateStreamToken = (userId)=>{
  try{
    const userIdStr= userId.toString(); // ensure userId is in string
    return streamClient.createToken(userIdStr);

    
  }
  catch(err){
    return resizeBy.status(500).json({message:"Server Error in generating Stream Token"});
  }
}



