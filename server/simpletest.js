// simpletest.js
require("dotenv").config();

const { MongoClient } = require("mongodb");

console.log("URI:", process.env.MONGO_URI);

async function test() {
  try {
    const client = new MongoClient(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    await client.connect();

    console.log("✅ CONNECTED TO MONGODB");

    const db = client.db("MyNodeAppDB");

    const collections = await db.listCollections().toArray();

    console.log("Collections:", collections);

    await client.close();
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
  }
}

test();