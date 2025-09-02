const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Mock data (pretend "static" table)
let staticData = [
  { id: 1, userAgent: "Mozilla/5.0", timestamp: "2025-09-01T12:00:00Z" },
  { id: 2, userAgent: "Chrome/139.0", timestamp: "2025-09-01T12:10:00Z" },
];

// Routes
// GET all
app.get("/api/static", (req, res) => {
  res.json(staticData);
});

// GET by ID
app.get("/api/static/:id", (req, res) => {
  const entry = staticData.find(e => e.id === parseInt(req.params.id));
  entry ? res.json(entry) : res.status(404).json({ error: "Not found" });
});

// POST (create new entry)
app.post("/api/static", (req, res) => {
  const newEntry = { id: staticData.length + 1, ...req.body };
  staticData.push(newEntry);
  res.status(201).json(newEntry);
});

// PUT (update by ID)
app.put("/api/static/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = staticData.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  staticData[index] = { id, ...req.body };
  res.json(staticData[index]);
});

// DELETE
app.delete("/api/static/:id", (req, res) => {
  const id = parseInt(req.params.id);
  staticData = staticData.filter(e => e.id !== id);
  res.json({ message: `Entry ${id} deleted` });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
