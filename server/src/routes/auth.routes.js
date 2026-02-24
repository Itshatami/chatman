import { Router } from "express";
import { authentication } from "../controllers/auth.controller.js";

const router = Router();

router.post("/", authentication);

const authRouter = router;
export default authRouter;
