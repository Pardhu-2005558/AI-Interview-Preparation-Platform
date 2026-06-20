// test.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

async function run() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    console.log("✅ MongoDB Connected Successfully");

    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run();