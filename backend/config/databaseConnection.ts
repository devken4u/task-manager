import "dotenv/config";
import mongoose from "mongoose";

// fetch the mongo db uri from the environment variables
const connectionString = process.env.MONGO_URI;

const databaseConnection = async () => {
  try {
    // check if connection string is empty
    // if empty throw an error
    if (!connectionString) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(connectionString);
    console.log(`Successfully connected to database -> ${connectionString}`);
  } catch (error) {
    // throw an error if any other problems occur
    throw error;
  }
};

export default databaseConnection;

