// backend/controllers/WeekController.js

import Week from "../models/week.js";
import getCurrentWeek from "../utils/getCurrentWeek.js";

/**
 * Get current week plan
 */
export const getCurrentWeekPlan = async (req, res, next) => {
  try {
    const currentWeekNumber = getCurrentWeek();

    const currentWeek = await Week.findOne({
      weekNumber: currentWeekNumber
    }).populate("chapters");

    if (!currentWeek) {
      return res.status(404).json({
        success: false,
        message: "Current week not found"
      });
    }

    return res.status(200).json({
      success: true,
      currentWeek: currentWeekNumber,
      data: currentWeek
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get week by number (manual week selection)
 */
export const getWeekByNumber = async (req, res, next) => {
  try {
    const { weekNumber } = req.params;

    const week = await Week.findOne({
      weekNumber: Number(weekNumber)
    }).populate("chapters");

    if (!week) {
      return res.status(404).json({
        success: false,
        message: "Week not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: week
    });

  } catch (error) {
    next(error);
  }
};