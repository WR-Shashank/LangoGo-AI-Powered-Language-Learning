import jwt from "jsonwebtoken";
import User from "../models/User.js";

// the mistake i did while making this page at my own is , i did not make try catch block
//second i did not import the cookieparser in server.js to use it as middleware
//third was i had not added the user in req after finding it

export const protectRoute = async (req,res,next) =>{

    try{
        const token= req.cookies.token; // Get the token from cookies // we can't access cookies directly for this we need to import cookie-parser in server.js and use it as middleware
        if(!token){
            return res.status(401).json({message: 'Unauthorized access token not found, please login!'});
        }
        let decoded="";
        try{
            //particular try catch for jwt verification b/c that can't be handeled with if(!decoded)

            decoded = jwt.verify((token),process.env.JWT_SECRET_KEY); // Verify the token using the secret key
            // here we dont need to check password's and email because this is main benifit of jwt we check these fields only once at login or signup and then we give them token in cookies and just check if the token is valid or not
            
            if(!decoded){
                return res.status(401).json({message: 'Unauthorized access token is invalid, please login!'});
            }
        }
        catch(err){
            return res.status(401).json({message:"Token is Invalid"});
        }
        
        
        const user = await User.findOne({_id: decoded._id}).select("-password")/**isse password hat jayega or baki sab user mai aa jayega */; // Find the user by ID from the decoded token

            if(!user){
                return res.status(404).json({message: 'User not found!'});
            }
            req.user=user; // Attach the user to the request object for further use in the route handlers
            // by doing this we ensure that if the user if ProtectedRoute then we can access the user in the route handler by req.user
        

        next();

    }
    catch(err){
        console.error('Error in protectRoute middleware:', err);
        res.status(500).json({message: 'Internal server error'});
    }
    
}
