import express from "express";
import cors from 'cors'

const app = express();

// Body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors())

// Routes

// Error handler
app.use((err, req, res, next) => {
  return res.status(404).json({ error: err.message });
});

// Not found
app.use((req, res, next) => {
  return res.status(404).json({ error: "Not found" });
});

export default app;
