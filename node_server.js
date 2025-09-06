// server.js
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: 'https://reporting.1deca.de',
    methods: ['GET','POST','OPTIONS','DELETE','PUT'],
    allowedHeaders: ['Content-Type','Authorization']
}));

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
        try {
            const docs = await performanceCollection.find({}, { projection: { _id: 0 } }).toArray();

            const rData = docs.map(doc => {
                const newAPI = doc.data.timingObj?.timingNewAPI ?? {};
                const oldAPI = doc.data.timingObj?.timingOldAPI ?? {};

                return {
                    "ID": doc.id,
                    "Session": doc.sessionId,
                    "Time": doc.timestamp,
                    "Timing Page Start Load": doc.data.timingPageStartLoad,
                    "Timing Page End Load": doc.data.timingPageEndLoad,
                    "Total Load Time": doc.data.totalLoadTime,

                    // Split New API fields
                    "New API Name": newAPI.name,
                    "New API Entry Type": newAPI.entryType,
                    "New API Start Time": newAPI.startTime,
                    "New API Duration": newAPI.duration,
                    "New API Initiator Type": newAPI.initiatorType,
                    "New API Response Status": newAPI.responseStatus,
                    "New API DOM Interactive": newAPI.domInteractive,
                    "New API DOM Complete": newAPI.domComplete,
                    "New API Load Event Start": newAPI.loadEventStart,
                    "New API Load Event End": newAPI.loadEventEnd,

                    // Split Old API fields
                    "Old API Connect Start": oldAPI.connectStart,
                    "Old API Secure Connection Start": oldAPI.secureConnectionStart,
                    "Old API Request Start": oldAPI.requestStart,
                    "Old API Response Start": oldAPI.responseStart,
                    "Old API Response End": oldAPI.responseEnd,
                    "Old API DOM Loading": oldAPI.domLoading,
                    "Old API DOM Content Loaded End": oldAPI.domContentLoadedEventEnd,
                    "Old API DOM Complete": oldAPI.domComplete,
                    "Old API Load Event End": oldAPI.loadEventEnd
                };
            });

            res.json(rData);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
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
        if (isNaN(id)) return res.status(400).send("Invalid ID format");

        try {
            const doc = await performanceCollection.findOne({ id: id }, { projection: { _id: 0 } });
            if (!doc) return res.status(404).send("Not found");

            const newAPI = doc.data.timingObj?.timingNewAPI ?? {};
            const oldAPI = doc.data.timingObj?.timingOldAPI ?? {};

            const rData = {
                "ID": doc.id,
                "Session": doc.sessionId,
                "Time": doc.timestamp,
                "Timing Page Start Load": doc.data.timingPageStartLoad,
                "Timing Page End Load": doc.data.timingPageEndLoad,
                "Total Load Time": doc.data.totalLoadTime,

                // Split New API fields
                "New API Name": newAPI.name,
                "New API Entry Type": newAPI.entryType,
                "New API Start Time": newAPI.startTime,
                "New API Duration": newAPI.duration,
                "New API Initiator Type": newAPI.initiatorType,
                "New API Response Status": newAPI.responseStatus,
                "New API DOM Interactive": newAPI.domInteractive,
                "New API DOM Complete": newAPI.domComplete,
                "New API Load Event Start": newAPI.loadEventStart,
                "New API Load Event End": newAPI.loadEventEnd,

                // Split Old API fields
                "Old API Connect Start": oldAPI.connectStart,
                "Old API Secure Connection Start": oldAPI.secureConnectionStart,
                "Old API Request Start": oldAPI.requestStart,
                "Old API Response Start": oldAPI.responseStart,
                "Old API Response End": oldAPI.responseEnd,
                "Old API DOM Loading": oldAPI.domLoading,
                "Old API DOM Content Loaded End": oldAPI.domContentLoadedEventEnd,
                "Old API DOM Complete": oldAPI.domComplete,
                "Old API Load Event End": oldAPI.loadEventEnd
            };

            res.json(rData);
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
        try {
            const docs = await activityCollection.find({}, { projection: { _id: 0 } }).toArray();

            const rData = docs.map(doc => {
                const mouseMoves = doc.data.mouseMoves ?? [];
                const clicks = doc.data.clicks ?? [];
                const scrolls = doc.data.scrolls ?? [];
                const keyEvents = doc.data.keyEvents ?? [];
                const errors = doc.data.errors ?? [];
                const idlePeriods = doc.data.idlePeriods ?? [];

                return {
                    "ID": doc.id,
                    "Session": doc.data.sessionId,
                    "Time": doc.timestamp,
                    "Mouse": mouseMoves.length > 0 ? "moved" : "none",
                    "Mouse Count": mouseMoves.length,
                    "Click": clicks.length > 0 ? "clicked" : "none",
                    "Click Count": clicks.length,
                    "Scroll": scrolls.length > 0 ? "scrolled" : "none",
                    "Scroll Count": scrolls.length,
                    "Key Events": keyEvents.length > 0 ? "some" : "none",
                    "Key Events Count": keyEvents.length,
                    "Errors": errors.length > 0 ? "some" : "none",
                    "Errors Count": errors.length,
                    "Idle Periods": idlePeriods.length > 0 ? "some" : "none",
                    "Idle Periods Count": idlePeriods.length,
                    "Page Enter": doc.data.pageEnter,
                    "Page Leave": doc.data.pageLeave,
                    "Page URL": doc.data.pageURL,
                    "Note": "For full details, check the database directly."
                };
            });

            res.json(rData);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
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
        if (isNaN(id)) return res.status(400).send("Invalid ID format");

        try {
            const doc = await activityCollection.findOne({ id: id }, { projection: { _id: 0 } });
            if (!doc) return res.status(404).send("Not found");

            const mouseMovements = doc.data.mouseMoves ?? [];
            const clicks = doc.data.clicks ?? [];
            const scrolls = doc.data.scrolls ?? [];

            const rData = {
                "ID": doc.id,
                "Session": doc.data.sessionId,
                "Time": doc.timestamp,
                "Mouse X": mouseMovements.map(m => m.x),
                "Mouse Y": mouseMovements.map(m => m.y),
                "Mouse Time": mouseMovements.map(m => m.time),
                "Click X": clicks.map(c => c.x),
                "Click Y": clicks.map(c => c.y),
                "Click Button": clicks.map(c => c.button),
                "Click Time": clicks.map(c => c.time),
                "Scroll X": scrolls.map(s => s.scrollX),
                "Scroll Y": scrolls.map(s => s.scrollY),
                "Scroll Time": scrolls.map(s => s.time),
                "Key Events": doc.data.keyEvents ?? [],
                "Errors": doc.data.errors ?? [],
                "Idle Periods": doc.data.idlePeriods ?? [],
                "Page Enter": doc.data.pageEnter,
                "Page Leave": doc.data.pageLeave,
                "Page URL": doc.data.pageURL
            };

            res.json(rData);
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