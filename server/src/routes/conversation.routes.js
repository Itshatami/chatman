import { Router } from "express";
import {
  findConversationById,
  findOrCreateConversation,
  getAllUserConversations,
} from "../controllers/conversation.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, getAllUserConversations);
router.get("/:conversationId", auth, findConversationById);
router.post("/", auth, findOrCreateConversation);

const conversationRouter = router;
export default conversationRouter;
