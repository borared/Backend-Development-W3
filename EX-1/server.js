import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));

// home page
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Home Page</h1><p>This is an Express.js server.</p>",
  );
});

// ex2
const routes = {
  "/about": "About us: at CADT, we love node.js!",
  "/contact-us": "You can reach us via email...",
  "/products": "Buy one get one...",
  "/projects": "Here are our awesome projects",
};

Object.keys(routes).forEach((routePath) => {
  app.get(routePath, (req, res) => res.send(routes[routePath]));
});

// ex3
app.get("/contact", (req, res) => {
  res.send(`
        <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post("/contact", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).send("Name cannot be empty");
  }

  const submissionsFile = path.join(__dirname, "submissions.json");

  fs.readFile(submissionsFile, "utf8", (err, data) => {
    let submissions = err ? [] : JSON.parse(data || "[]");
    submissions.push({
      name,
      submittedAt: new Date().toLocaleString(),
    });

    fs.writeFile(
      submissionsFile,
      JSON.stringify(submissions, null, 2),
      (err) => {
        if (err) return res.status(500).send("Error saving submission");
        res.send(`<h1>Submission Successful</h1><p>Thank you, ${name}!</p>`);
      },
    );
  });
});

// 404 error handling
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
