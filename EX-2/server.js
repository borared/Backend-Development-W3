// server.js
import express from "express";
import courses from "./course.js";
const app = express();
const PORT = 3001; // use 3001 to avoid conflict with EX-1 server

// Route: GET /departments/:dept/courses
// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`[EX-2] ${req.method} ${req.url}`);
  next();
});

app.get("/departments/:dept/courses", (req, res) => {
  const { dept } = req.params;
  const { level, minCredits, maxCredits, semester, instructor } = req.query;

  // Edge case 1: Invalid credit range
  if (minCredits && maxCredits && parseInt(minCredits) > parseInt(maxCredits)) {
    return res.status(400).json({
      error:
        "Invalid credit range: minCredits cannot be greater than maxCredits",
    });
  }

  // Filter courses based on criteria
  let filtered = courses.filter((course) => {
    // Check 1: Department must match (required)
    if (course.department !== dept) return false;

    // Check 2: If level filter provided, it must match
    if (level && course.level !== level) return false;

    // Check 3: If minCredits provided, course credits must be >= minCredits
    if (minCredits && course.credits < parseInt(minCredits)) return false;

    // Check 4: If maxCredits provided, course credits must be <= maxCredits
    if (maxCredits && course.credits > parseInt(maxCredits)) return false;

    // Check 5: If semester provided, it must match
    if (semester && course.semester !== semester) return false;

    // Check 6: If instructor provided, it must be a partial match (case-insensitive)
    if (
      instructor &&
      !course.instructor.toLowerCase().includes(instructor.toLowerCase())
    )
      return false;

    // All checks passed, include this course
    return true;
  });

  // Return formatted JSON response
  res.json({
    results: filtered,
    meta: {
      total: filtered.length,
      department: dept,
      appliedFilters: {
        level: level || null,
        minCredits: minCredits || null,
        maxCredits: maxCredits || null,
        semester: semester || null,
        instructor: instructor || null,
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
