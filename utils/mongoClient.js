// utils/mongoClient.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  maxPoolSize: 10, // optional tweak
});

let db;

async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db('test'); // <-- your database name
    console.log("✅ MongoDB singleton connected");
  }
  return db;
}

module.exports = getDb;
