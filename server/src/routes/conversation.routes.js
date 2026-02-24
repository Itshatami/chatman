import { Router } from "express";
import { getConversation } from "../controllers/conversation.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, getConversation);

const conversationRouter = router;
export default conversationRouter;
