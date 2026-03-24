import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req,res){
    const token = generateStreamToken(req.user._id);
    res.status(200).json({token});
}