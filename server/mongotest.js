// mongotest.js
const { MongoClient } = require("mongodb");

const uri =
"mongodb://interviewadmin:YOUR_PASSWORD@ac-f6nsd4z-shard-00-00.yhub6m2.mongodb.net:27017,ac-f6nsd4z-shard-00-01.yhub6m2.mongodb.net:27017,ac-f6nsd4z-shard-00-02.yhub6m2.mongodb.net:27017/?ssl=true&replicaSet=atlas-6meqox-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  try {
    const client = new MongoClient(uri);

    await client.connect();

    console.log("CONNECTED SUCCESSFULLY");

    await client.close();
  } catch (err) {
    console.log(err);
  }
}

run();