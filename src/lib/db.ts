import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env");
}

export const client = new MongoClient(uri);

let connected = false;

export async function checkDBConnection() {
  if (!connected) {
    await client.connect();
    connected = true;
  }

  await client.db().command({ ping: 1 });

  console.log("✅ MongoDB connected successfully!");
}
