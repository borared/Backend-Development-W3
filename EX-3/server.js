import express from "express";
import courses from "./course.js";
import logger from "./logger.js";
import validateQuery from "./validateQuery.js";
import auth from "./auth.js";

const app = express();
const PORT = 3002;

app.use(logger);

app.get("/departments/:dept/courses", validateQuery, auth, (req, res) => {
  const { dept } = req.params;
  const { level, minCredits, maxCredits, semester, instructor } = req.query;

  const filtered = courses.filter((course) => {
    if (course.department !== dept) return false;
    if (level && course.level !== level) return false;
    if (minCredits && course.credits < Number(minCredits)) return false;
    if (maxCredits && course.credits > Number(maxCredits)) return false;
    if (semester && course.semester !== semester) return false;
    if (
      instructor &&
      !course.instructor.toLowerCase().includes(instructor.toLowerCase())
    )
      return false;
    return true;
  });

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

app.listen(PORT, () =>
  console.log(`EX-3 server running at http://localhost:${PORT}`),
);
