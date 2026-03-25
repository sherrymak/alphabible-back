// backend/utils/getCurrentWeek.js

const getCurrentWeek = () => {
  const startDate = new Date("2025-01-01"); // Change if your program started on another date
  const today = new Date();

  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const weekNumber = Math.floor(diffDays / 7) + 1;

  return weekNumber > 0 ? weekNumber : 1;
};

export default getCurrentWeek;