require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "trujillo_ward";

let client;
let db;

async function connectToDatabase() {
  if (db) return db; // reutiliza si ya existe
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("✅ MongoDB connected");
  return db;
}

function getDb() {
  if (!db) throw new Error("Call connectToDatabase() first");
  return db;
}

function getCollection(name) {
  return getDb().collection(name);
}

async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("🔌 MongoDB disconnected");
  }
}

module.exports = { connectToDatabase, getDb, getCollection, closeDatabase };