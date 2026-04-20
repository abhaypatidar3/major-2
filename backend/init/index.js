import mongoose from "mongoose";
import { config } from "dotenv";
import sampleSolution from "./solutionData.js";
import { SymptomSolution } from "../models/symptomSolutionSchema.js";
import { connection } from "../database/connection.js";

config({ path: "./config/config.env" });

const initDB = async () => {
  try {
    connection();
    await SymptomSolution.deleteMany({});
    const inserted = await SymptomSolution.insertMany(sampleSolution.data);
    console.log(
      `Data initialized successfully. Inserted ${inserted.length} symptoms.`,
    );
  } catch (error) {
    console.error("Failed to initialize symptom data:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

initDB();
