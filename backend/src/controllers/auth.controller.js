import User from '../models/User.js';
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for token generation
import dotenv from 'dotenv';
import { upsertStreamUser } from '../lib/stream.js';
import { JWTUserToken } from 'stream-chat';

dotenv.config();

export async function signup(req,res){
        
    const {fullName,email,password} =req.body;

    try{
        
        if(!fullName || !email || !password){

            return res.status(400).json({message: 'Please fill all the fields!'});
        }
        if(password.length < 6){

            return res.status(400).json({message: 'Password must be at least 6 characters long!'});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // this we pasted from ai

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email already exists!'});
        }

        const idx=Math.floor((Math.random()*100)+1); // Math.random() generates radom no. between 0 and 1, 0 inclusive and 1 exclusive
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`; // this is a random avatar from the iran.liara.run service
        
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar, // Assigning the random avatar to the profilePic field
        });

        //TO-DO create the user in stream as well
        // we will put stream user creation in diff try catch block so that if stream user creation fails, it does not affect the signup process
        try{
            await upsertStreamUser({
                //these are the fields that stream needs to create a user
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || '',
            })
            console.log('Stream user created successfully for:', newUser._id);
        }
        catch(err){
            console.error('Error creating Stream user:', err);
        }

        const token= jwt.sign({_id:newUser._id},process.env.JWT_SECRET_KEY)

        res.cookie('token',token,{
            maxAge: 7* 24 * 60 * 60 * 1000, // 7 day in milliseconds
            httpOnly : true, // This makes the cookie inaccessible to JavaScript's Document.cookie API
            sameSite: "strict", //this prevent cross-site request forgery attacks
            secure: process.env.NODE_ENV === 'production', // this ensures the cookie is only sent over HTTPS in production
        })

        res.status(201).json({
            success:true,
            user: newUser,
            JWTUserToken:token
        })

    }
    catch(err){
        console.error('Error during signup:', err);
        res.status(500).json({message: 'Internal server error'});
    }
}

export async function login(req,res){

    const {email,password} = req.body;

    try{

        if(!email || !password){
            return res.status(400).json({message: 'Please fill all the fields!'});
        }
        const user =await User.findOne({email});
        
        if(!user){
            // 401 means unauthorized
            return res.status(401).json({message: 'Email or Password is Incorrect'}); // to user not found is not good practice we should tell email or password is incorrect
        }

        // to check password, we had made a method in user model
        const isCorrect = await user.matchPassword(password); // the fayda for making this as method is we need not to import function for compare passwords just want the user and can directly use it
        if(!isCorrect){
            return res.status(401).json({message: 'Email or Password is Incorrect'});
        }

        const token= jwt.sign({_id:user._id },process.env.JWT_SECRET_KEY)

        res.cookie('token',token,{
            maxAge: 7* 24 * 60 * 60 * 1000, // 7 day in milliseconds
            httpOnly : true, // This makes the cookie inaccessible to JavaScript's Document.cookie API
            sameSite: "strict", //this prevent cross-site request forgery attacks
            secure: process.env.NODE_ENV === 'production', // this ensures the cookie is only sent over HTTPS in production NODE_ENV is automatically setup by vite
        })

        res.status(201).json({
            success:true,
            user: user,
            message: 'Login successful!',
            token
        })


    }
    catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }
}

export function logout(req,res){

    //for logout we jusst have to clear token cookie
    res.clearCookie('token')
    res.status(200).json({success:true ,message: 'Logout successful!'});
   
}

export async function  onboarding(req,res){
   
    try{
        console.log(req.user)
        const userId = req.user._id; // we get user from protectRoute middleware

        const {fullName,NativeLanguage,LearningLanguage,location,Bio} = req.body;
        if(!NativeLanguage || !LearningLanguage || !location || !Bio){

            return res.status(400).json({message: 'Please fill all the fields!',
                missingFields: [
                    !fullName && "fullName",
                    !NativeLanguage && "NativeLanguage",
                    !LearningLanguage && "LearningLanguage",
                    !location && "location",
                    !Bio && "Bio"
                ].filter(Boolean), //by this we can filter false value like if fullname present
            });

        }


        console.log(userId);
        const updatedUser= await User.findOneAndUpdate(
            {_id:userId},
            {...req.body,isOnboarded:true},
            {new:true}
        );// new true will help in returning updated user 
        
        if(!updatedUser){
            return res.status(404).json({message: "Updated User Not Found"});
        }

        //TODO update the user in stream as well
        try{
            await upsertStreamUser({id:updatedUser._id.toString(),name:updatedUser.fullName,image:updatedUser.profilePic,language:updatedUser.NativeLanguage});
            console.log("Stream User Updated Succesfully after Onboarding");
        }
        catch(err){
            return res.status(400).json({message:"Error inUpdating Stream User"});
        }



        res.status(200).json({
            success: true,
            message: 'Onboarding completed successfully!',
            user: updatedUser
        });

    }
    catch(err){
        console.log("Error in Onboarding the user",err)
        return res.status(500).json({message: " internal server error"});
    }
}