import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { SymptomSolution } from "../models/symptomSolutionSchema.js";

export const getAllSymptoms = catchAsyncErrors(async (req, res, next) => {
  const allSymptoms = await SymptomSolution.find({});
  res.status(200).json({
    success: true,
    symptoms: allSymptoms,
  });
});

export const getSymptomById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const symptom = await SymptomSolution.findById(id);

  if (!symptom) {
    return next(new ErrorHandler("Symptom not found", 404));
  }

  res.status(200).json({
    success: true,
    symptom,
  });
});
