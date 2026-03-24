import express from 'express';
import { login, onboarding, logout, signup } from '../controllers/auth.controller.js'; // make sure to put .js at the end of controller
import { protectRoute } from '../middleware/auth.middleware.js';

const router= express.Router();

router.post('/signup',signup)

router.post('/login',login)

router.post('/logout',logout) // You might be wondering why logout is post even no data is sent, it is because we make route req Post whenver it changes the state of the server

router.post('/onboarding',protectRoute,onboarding)
// ensure that if the user if ProtectedRoute then we can access the user in the route handler by req.user in signup and login we can't access req.user

// this route is just to get loggedin user data
router.get('/me',protectRoute,(req,res)=>{ 
return res.status(200).json({user:req.user}); 
})

export default router;