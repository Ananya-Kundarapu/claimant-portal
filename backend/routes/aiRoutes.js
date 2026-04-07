import express from "express";
import { generateNextQuestion,aiHelpChat } from "../controllers/aiController.js";

const router = express.Router();

router.post("/next-question", generateNextQuestion);
router.post('/help', aiHelpChat);

export default router;