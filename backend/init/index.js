import mongoose from "mongoose";
import sampleSolution from './solutionData.js'
import { SymptomSolution } from "../models/symptomSolutionSchema.js";
import { connection } from "../database/connection.js";

connection();

const initDB = async()=>{
    await SymptomSolution.deleteMany({});
    await SymptomSolution.insertMany(sampleSolution.data);
    console.log("Data is initialized");
}

initDB();