import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("API Working");
});

// Webhook endpoint - must use raw body for signature verification
app.post("/clerk", express.raw({ type: 'application/json' }), clerkWebhooks);


// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running at port ${PORT}`);
});
