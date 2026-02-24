import { Router } from "express";
import { getMessages } from "../controllers/message.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:conversationId", auth, getMessages);

const messageRouter = router;
export default messageRouter;
