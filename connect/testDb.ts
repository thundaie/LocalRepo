import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ConnectOptions } from "mongoose";

let testMongoDb: MongoMemoryServer;

async function connect(): Promise<void> {
  testMongoDb = await MongoMemoryServer.create();
  const uri = testMongoDb.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
  }
  await mongoose.connect(uri, mongooseOpts as ConnectOptions);
}

async function close(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close()
  await testMongoDb.stop();
}

async function clear(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

export default {
  connect,
  close,
  clear
}