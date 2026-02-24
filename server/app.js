import express from "express";
import cors from "cors";
import conversationRouter from "./src/routes/conversation.routes.js";
import messageRouter from "./src/routes/message.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import auth from "./src/middleware/auth.middleware.js";

const app = express();

// Body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.get("/check", auth, (req, res) => {
  return res.json({ message: "authentication successful", user: req.user });
});

// Error handler
app.use((err, req, res, next) => {
  return res.status(404).json({ error: err.message });
});

// Not found
app.use((req, res, next) => {
  return res.status(404).json({ error: "Not found" });
});

export default app;
