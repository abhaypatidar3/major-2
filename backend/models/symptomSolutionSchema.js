import mongoose from "mongoose";

const symptomSolutionSchema = new mongoose.Schema({
  symptom: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://i.pinimg.com/736x/b5/e7/db/b5e7db619ad464cc016acc8be5edf6c4.jpg",
    set: (v) =>
      v === ""
        ? "https://i.pinimg.com/736x/b5/e7/db/b5e7db619ad464cc016acc8be5edf6c4.jpg"
        : v,
  },
  solutions: {
    yoga: [
      {
        name: { type: String, required: true },
        benefits: [String],
        howToDo: { type: String, required: true },
        whenToDo: { type: String },
        image: { type: String, default: "default_yoga_image_url.jpg" },
      },
    ],
    diet: {
      eat: [
        {
          item: { type: String, required: true },
          benefits: [String],
          quantity: { type: String },
          image: { type: String, default: "default_food_image_url.jpg" },
        },
      ],
      avoid: [
        {
          item: { type: String, required: true },
          reasons: [String],
          image: { type: String, default: "default_food_image_url.jpg" },
        },
      ],
    },
    homeRemedies: [
      {
        remedy: { type: String, required: true },
        ingredients: [String],
        preparation: { type: String, required: true },
        benefits: [String],
        image: { type: String, default: "default_remedy_image_url.jpg" },
      },
    ],
    otcMedications: [
      {
        name: { type: String, required: true },
        usage: { type: String, required: true },
        sideEffects: [String],
        image: { type: String, default: "default_medication_image_url.jpg" },
      },
    ],
    herbalTreatments: [
      {
        herb: { type: String, required: true },
        benefits: [String],
        preparation: { type: String },
        precautions: [String],
        image: { type: String, default: "default_herbal_image_url.jpg" },
      },
    ],
  },
});

export const SymptomSolution = mongoose.model(
  "SymptomSolution",
  symptomSolutionSchema
);
