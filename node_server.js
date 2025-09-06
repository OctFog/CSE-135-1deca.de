// server.js
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ----------------------
// MongoDB Connection
// ----------------------
// const uri = "mongodb://localhost:27017"; // default port 27017
// const client = new MongoClient(uri);

let staticCollection, activityCollection, performanceCollection;

async function connectDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log("MongoDB connected!");

  const db = client.db(process.env.DB_NAME);
  staticCollection = db.collection("static");
  activityCollection = db.collection("activity");
  performanceCollection = db.collection("performance");
  countersCollection = db.collection("counters");
  return db;
}



// ----------------------
// HELPER: select collection by type
// ----------------------
function getCollectionByType(type) {
  if (type === "static") return staticCollection;
  if (type === "performance") return performanceCollection;
  if (type === "activity") return activityCollection;
  throw new Error("Unknown type: " + type);
}


connectDB()
  .then(() => {
    // ----------------------
    // STATIC ROUTES
    // ----------------------
    app.get("/api/static", async (req, res) => {
        try {
            const docs = await staticCollection.find({}, { projection: { _id: 0 } }).toArray();
            const rData = docs.map(doc => ({
                "ID": doc.id,
                "Session": doc.data.sessionId,
                "Time": doc.timestamp,
                "User Agent": doc.data.userAgent,
                "Language": doc.data.language,
                "Accepts Cookies": doc.data.acceptsCookies,
                "Allow JavaScript": doc.data.allowsJS,
                "Allow Images": doc.data.allowsImages,
                "Allow CSS": doc.data.allowsCSS,
                "Screen Dimensions": {
                    width: doc.data.screenDiemensions?.width ?? 0,
                    height: doc.data.screenDiemensions?.height ?? 0
                },
                "Window Dimensions": {
                    innerWidth: doc.data.windowDimensions?.innerWidth ?? 0,
                    innerHeight: doc.data.windowDimensions?.innerHeight ?? 0,
                    outerWidth: doc.data.windowDimensions?.outerWidth ?? 0,
                    outerHeight: doc.data.windowDimensions?.outerHeight ?? 0
                },
                "Network Connection Type": doc.data.networkConnectionType
            }));

            res.json(rData);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.get("/api/static/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).send("Invalid ID format");

        try {
            const doc = await staticCollection.findOne({ id: id }, { projection: { _id: 0 } });
            if (!doc) return res.status(404).send("Not found");

            const rData = {
                "ID": doc.id,
                "Session": doc.data.sessionId,
                "Time": doc.timestamp,
                "User Agent": doc.data.userAgent,
                "Language": doc.data.language,
                "Accepts Cookies": doc.data.acceptsCookies,
                "Allow JavaScript": doc.data.allowsJS,
                "Allow Images": doc.data.allowsImages,
                "Allow CSS": doc.data.allowsCSS,
                "Screen Dimensions": {
                    width: doc.data.screenDiemensions?.width ?? 0,
                    height: doc.data.screenDiemensions?.height ?? 0
                },
                "Window Dimensions": {
                    innerWidth: doc.data.windowDimensions?.innerWidth ?? 0,
                    innerHeight: doc.data.windowDimensions?.innerHeight ?? 0,
                    outerWidth: doc.data.windowDimensions?.outerWidth ?? 0,
                    outerHeight: doc.data.windowDimensions?.outerHeight ?? 0
                },
                "Network Connection Type": doc.data.networkConnectionType
            };

            res.json(rData);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.post("/api/static", async (req, res) => {
        try {
            const newId = await getNextSequence("static");
            const doc = { ...req.body, id: newId };
            const result = await staticCollection.insertOne(doc);
            res.status(201).json(doc);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
        
    });

    app.put("/api/static/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const result = await staticCollection.findOneAndUpdate(
                { id: id },
                { $set: req.body },
                { returnDocument: "after" }
            );
            if (!result.value) return res.status(404).send("Not found");
            res.json(result.value);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.delete("/api/static/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const result = await staticCollection.deleteOne({ id: id });
            if (result.deletedCount === 0) return res.status(404).send("Not found");
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    // ----------------------
    // PERFORMANCE ROUTES
    // ----------------------
    app.get("/api/performance", async (req, res) => {
        const data = await performanceCollection.find().toArray();
        res.json(data);
    });

    app.post("/api/performance", async (req, res) => {
        try {
            const newId = await getNextSequence("performance");
            const doc = { ...req.body, id: newId };
            const result = await performanceCollection.insertOne(doc);
            res.status(201).json(doc);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.get("/api/performance/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const entry = await performanceCollection.findOne({ id: id });
            if (!entry) return res.status(404).send("Not found");
            res.json(entry);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.put("/api/performance/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const result = await performanceCollection.findOneAndUpdate(
                { id: id },
                { $set: req.body },
                { returnDocument: "after" }
            );
            if (!result.value) return res.status(404).send("Not found");
            res.json(result.value);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.delete("/api/performance/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const result = await performanceCollection.deleteOne({ id: id });
            if (result.deletedCount === 0) return res.status(404).send("Not found");
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    // ----------------------
    // ACTIVITY ROUTES
    // ----------------------
    app.get("/api/activity", async (req, res) => {
        const data = await activityCollection.find().toArray();
        res.json(data);
    });

    app.post("/api/activity", async (req, res) => {
        try {
            const newId = await getNextSequence("activity");
            const doc = { ...req.body, id: newId };
            const result = await activityCollection.insertOne(doc);
            res.status(201).json(doc);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.get("/api/activity/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const entry = await activityCollection.findOne({ id: id });
            if (!entry) return res.status(404).send("Not found");
            res.json(entry);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.put("/api/activity/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const result = await activityCollection.findOneAndUpdate(
                { id: new id },
                { $set: req.body },
                { returnDocument: "after" }
            );
            if (!result.value) return res.status(404).send("Not found");
            res.json(result.value);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    app.delete("/api/activity/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);

        try {
            const result = await activityCollection.deleteOne({ id: id });
            if (result.deletedCount === 0) return res.status(404).send("Not found");
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    // Helper
    async function getNextSequence(name) {
        const result = await countersCollection.findOneAndUpdate(
            { _id: name },
            { $inc: { seq: 1 } },
            { upsert: true, returnDocument: "after" }
        );

        // If no value was returned (newly upserted doc), start at 1
        if (!result.value) {
            const doc = await countersCollection.findOne({ _id: name });
            return doc.seq;
        }

        return result.value.seq;
    }




    // ----------------------
    // START SERVER
    // ----------------------
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

})
.catch((err) => console.error("Failed to connect to MongoDB:", err));