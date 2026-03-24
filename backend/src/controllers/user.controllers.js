import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUser(req,res){

    /*const AllUsers = await User.find({});
    const recommendedUsers = AllUsers.filter((e)=>{
        return req.user.LearningLanguage===e.NativeLanguage;
    })*/ // initially i was doing this

    // here we want all users except our friends and self
    // also i tried to add recommendation as same native & learning lang or our learning lang to their native lang
    
    try{
        let recommendedUsers = await User.find({
        $and :[
            {_id: {$ne : req.user._id}},
            {_id: {$nin : req.user.friends}},
            {isOnboarded:true}
        ]
        })
        // $and: [ iske andar ki sari condition true] , $nin to find users that arnot included in req.user.friend , $ne = not equal

        const myFieldUsers =  recommendedUsers.filter((e)=>{
            return req.user.LearningLanguage===e.NativeLanguage || req.user.NativeLanguage===e.NativeLanguage || req.user.LearningLanguage===e.LearningLanguage;
        })
        if(myFieldUsers){
            recommendedUsers=myFieldUsers;
        }

        return res.status(200).json(recommendedUsers)
    }
    catch(err){
        return res.status(500).json({message:"Error in Getting Recommended Users",err})
    }
}

export async function getFriends(req,res){

    try{
        /*const friendsIdArr = req.user.friends;
        const friendsDataArr = friendsIdArr.map(async (friendId)=>{
            const data= await User.findById(friendId) 
            return data;
        })*/ 
        // above method is what we did but its wrong since async map returns promise not the data but that is something we can handle 
        // but also there is problem with lots of database calls one per friend SO,

        const user =await User.findById(req.user._id).select("friends").populate("friends","fullName profilePic NativeLanguage LearningLanguage") //this line will select only friends field from user replace its array filled with id's to friends array filled with data of that  user id's and this is done by populate function
        return res.status(200).json(user);

    }
    catch(err){
        return res.status(500).json({message: "Error in finding Friends Data",err})
    }

}

export async function sendFriendRequest(req,res){
    try{
        const myId=req.user._id;
       
        const receiverId=req.params.receiverId;
        

        //prevent sending req to self kar sakte ho karna ho to
        if(myId.toString()===receiverId.toString()){
            return res.status(400).json({message:"You can't send friend request to yourself"})
        }

        //check if reciever exist
        const reciever = await User.findById(receiverId);
        if(!reciever){
            return res.status(404).json({message:"Reciever not found"})
        }

        //check if already friend
        const isFriend=req.user.friends.includes(receiverId);
        if(isFriend){

            return res.status(400).json({message:"friend already exists"})

        }
        
        // check if friend request already exist
        const existingRequest = await FriendRequest.findOne({
            $or : [
                {sender:myId , reciever:receiverId},
                {sender:receiverId,receiver:myId}
            ]
        })

        if(existingRequest){
            return res.status(400).json({message:"friend Request already exists"})
        }

        const friendRequest= await FriendRequest.create({
            sender:myId,
            reciever:receiverId
        })
        res.status(201).json({friendRequest})
    }
    catch(err){
        console.log("Error in Sending Friend Request",err)
        res.status(500).json({message:"Internal Server Error",err});
    }
}


export async function acceptFriendRequest(req,res){
    try{
        const myId =req.user._id;
        const senderId = req.params.senderId;

        const friendRequest = await FriendRequest.findOneAndUpdate({
            sender:senderId,
            reciever:myId
        },{status:"accepted"},{new:true})

        if(!friendRequest){
            res.status(404).json({message:"Friend Request not found"})
        }

        //$addToSet instead of push will push only when if not already exist
        const sender = await User.findByIdAndUpdate(senderId,{
            $push: {friends: myId}
        });
        const reciever = await User.findByIdAndUpdate(myId,{
            $push: {friends:senderId}
        });
        res.status(200).json({message:"Friend Request Accepted"});

    }
    catch(err){
        res.status(500).json({message:"Internal Server Error in Accepting Friend Request",err});
    }
}

export async function getFriendRequests(req,res){
    try{
        const myId= req.user._id;
        const incommingReq = await FriendRequest.find({reciever:myId,status:"pending"}).populate("sender","fullName profilePic NativeLanguage LearningLanguage"); //here we didn't applied select so all data will return

        const acceptedReq = await FriendRequest.find({sender:myId , status:"accepted"}).populate("reciever","fullName profilePic")

        return res.status(200).json({incommingReq,acceptedReq});
    }
    catch(err){
        return res.status(500).json({err,message:"Server Error in Getting Friend Request"})
    }
}

export async function getSentFriendRequests(req,res){
    //this is for home page jaha ham user dikha rhe hai to send friend req
    // to ye vala route vo user ko bateyga jinko friend req jaa chuki hai

    try{
        const myId= req.user._id;
        const sentFriendReq = await FriendRequest.find({sender:myId, status:"pending"}).populate("reciever","fullName profilePic NativeLanguage LearningLanguage");
        return res.status(200).json(sentFriendReq);

    }
    catch(err){
        return res.status(500).json({err,message:"Server Error in Getting Sent Friend Request"})
    }
}

// export async function rejectFriendRequest(req,res){
//     try{
//         await FriendRequest.findOneAndDelete({
//             sender:req.params.friendId,
//             reciever:req.user._id
//         })
//         return res.status(200).json({message:"request Removed"});

//     }
//     catch(err){
//         res.status(500).json({message:"Internal Server Error in Rejecting Friend Request",err});
//     }
// }

// export async function deleteFriendRequest(req,res){
//     try{
//         await FriendRequest.findOneAndDelete({
//             reciever:req.params.friendId,
//             sender:req.user._id
//         })
//         return res.status(200).json({message:"request deleted"});

//     }
//     catch(err){
//         res.status(500).json({message:"Internal Server Error in Rejecting Friend Request",err});
//     }
// }


