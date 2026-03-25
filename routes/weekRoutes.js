import express from "express";
import {
  getWeekByNumber,
  getCurrentWeekPlan
} from "../controllers/WeekController.js";

const router = express.Router();

// Get current week automatically
router.get("/current", getCurrentWeekPlan);

// Get specific week
router.get("/:weekNumber", getWeekByNumber);



export default router;