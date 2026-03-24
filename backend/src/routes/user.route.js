import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import User from '../models/User.js';
import { acceptFriendRequest, getFriendRequests, getFriends, getRecommendedUser, getSentFriendRequests, sendFriendRequest } from '../controllers/user.controllers.js';



const router = express.Router();

// instead of pasting everytime protectRoute we just make it as middleware
router.use(protectRoute);


router.get("/", getRecommendedUser); 
router.get("/friends",getFriends);
router.post("/friendRequest/:receiverId",sendFriendRequest);
router.post("/acceptfriendRequest/:senderId",acceptFriendRequest);

//router.post("/rejectfriendRequest/:friendId",rejectFriendRequest); commenting b/c not in tutorial once make tutorial one then i will add these
//router.post("/deletefriendRequest/:friendId",deleteFriendRequest);

router.get("/friendRequests",getFriendRequests)
router.get("/sentFriendRequests",getSentFriendRequests);








export default router ;


