// server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------
// MongoDB Connection
// ----------------------
// const uri = "mongodb://localhost:27017"; // default port 27017
// const client = new MongoClient(uri);

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.DB_NAME);

// let db, 

let staticCollection, performanceCollection, activityCollection;

async function connectDB() {
  await client.connect();
  db = client.db("mydb"); // database name
  staticCollection = db.collection("static");
  performanceCollection = db.collection("performance");
  activityCollection = db.collection("activity");
  console.log("Connected to MongoDB");
}

connectDB();

// ----------------------
// HELPER: select collection by type
// ----------------------
function getCollectionByType(type) {
  if (type === "static") return staticCollection;
  if (type === "performance") return performanceCollection;
  if (type === "activity") return activityCollection;
  throw new Error("Unknown type: " + type);
}

// ----------------------
// STATIC ROUTES
// ----------------------
app.get("/api/static", async (req, res) => {
  const data = await staticCollection.find().toArray();
  res.json(data);
});

app.get("/api/static/:id", async (req, res) => {
  const entry = await staticCollection.findOne({ _id: new ObjectId(req.params.id) });
  if (!entry) return res.status(404).send("Not found");
  res.json(entry);
});

app.post("/api/static", async (req, res) => {
  const result = await staticCollection.insertOne(req.body);
  res.status(201).json({ _id: result.insertedId, ...req.body });
});

app.put("/api/static/:id", async (req, res) => {
  const result = await staticCollection.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body },
    { returnDocument: "after" }
  );
  if (!result.value) return res.status(404).send("Not found");
  res.json(result.value);
});

app.delete("/api/static/:id", async (req, res) => {
  const result = await staticCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).send("Not found");
  res.status(204).send();
});

// ----------------------
// PERFORMANCE ROUTES
// ----------------------
app.get("/api/performance", async (req, res) => {
  const data = await performanceCollection.find().toArray();
  res.json(data);
});

app.get("/api/performance/:id", async (req, res) => {
  const entry = await performanceCollection.findOne({ _id: new ObjectId(req.params.id) });
  if (!entry) return res.status(404).send("Not found");
  res.json(entry);
});

app.post("/api/performance", async (req, res) => {
  const result = await performanceCollection.insertOne(req.body);
  res.status(201).json({ _id: result.insertedId, ...req.body });
});

app.put("/api/performance/:id", async (req, res) => {
  const result = await performanceCollection.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body },
    { returnDocument: "after" }
  );
  if (!result.value) return res.status(404).send("Not found");
  res.json(result.value);
});

app.delete("/api/performance/:id", async (req, res) => {
  const result = await performanceCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).send("Not found");
  res.status(204).send();
});

// ----------------------
// ACTIVITY ROUTES
// ----------------------
app.get("/api/activity", async (req, res) => {
  const data = await activityCollection.find().toArray();
  res.json(data);
});

app.get("/api/activity/:id", async (req, res) => {
  const entry = await activityCollection.findOne({ _id: new ObjectId(req.params.id) });
  if (!entry) return res.status(404).send("Not found");
  res.json(entry);
});

app.post("/api/activity", async (req, res) => {
  const result = await activityCollection.insertOne(req.body);
  res.status(201).json({ _id: result.insertedId, ...req.body });
});

app.put("/api/activity/:id", async (req, res) => {
  const result = await activityCollection.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body },
    { returnDocument: "after" }
  );
  if (!result.value) return res.status(404).send("Not found");
  res.json(result.value);
});

app.delete("/api/activity/:id", async (req, res) => {
  const result = await activityCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).send("Not found");
  res.status(204).send();
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
