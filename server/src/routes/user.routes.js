import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { searchUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", auth,searchUser);

const userRouter = router;
export default userRouter;
