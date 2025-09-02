// import.js
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // MongoDB URL
const client = new MongoClient(uri);

async function importData() {
  try {
    await client.connect();
    const db = client.db("mydb"); // database name

    // Define collections
    const staticCollection = db.collection("static");
    const performanceCollection = db.collection("performance");
    const activityCollection = db.collection("activity");

    // Read db.json
    const filePath = path.join(__dirname, "db.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    if (!jsonData.userData || !Array.isArray(jsonData.userData)) {
      console.error("userData array not found in db.json");
      return;
    }

    // Insert each entry
    for (const entry of jsonData.userData) {
      const { type, data, id } = entry;
      let collection;

      if (type === "static") collection = staticCollection;
      else if (type === "performance") collection = performanceCollection;
      else if (type === "activity") collection = activityCollection;
      else continue;

      // Upsert to prevent duplicates
      await collection.updateOne(
        { originalId: id },
        { $setOnInsert: { ...data, originalId: id } },
        { upsert: true }
      );
    }

    console.log("All userData imported successfully!");
  } catch (err) {
    console.error("Error importing data:", err);
  } finally {
    await client.close();
  }
}

// Run the import
importData();
