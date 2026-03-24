import express from 'express'
import { openAI } from '../service/openAI.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post("/",protectRoute,openAI);

export default router;