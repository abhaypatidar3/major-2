import mongoose from "mongoose";

export const connection = () => {
  const primaryMongoUrl = process.env.MONGO_URL;
  const localMongoUrl =
    process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
  const dbName = process.env.MONGO_DB_NAME || "SYNCORA_TWO";

  if (!primaryMongoUrl) {
    console.log("MONGO_URL is not set. Trying local MongoDB...");
    mongoose
      .connect(localMongoUrl, { dbName })
      .then(() => console.log("Database connected (local)"))
      .catch((err) => console.log(`Error occurred: ${err}`));
    return;
  }

  mongoose
    .connect(primaryMongoUrl, { dbName })
    .then(() => console.log("Database connected"))
    .catch((err) => {
      console.log(`Error occurred: ${err}`);
      console.log("Falling back to local MongoDB...");
      mongoose
        .connect(localMongoUrl, { dbName })
        .then(() => console.log("Database connected (local)"))
        .catch((localErr) => console.log(`Local DB error: ${localErr}`));
    });
};
