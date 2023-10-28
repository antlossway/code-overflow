import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("No MONGODB_URI env variable set");
  }

  if (isConnected) {
    // console.log("=> using existing database connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "codeflow",
    });
    isConnected = true;
    console.log("=> new database connection, MongoDB is connected");
  } catch (error: any) {
    console.log("=> error connecting to MongoDB:", error.message);
  }
};
