import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  experience: {
    type: String,
  },
  area: {
    type: String,
  },
  city: {
    type: String,
    required: true,
    index: true,
  },
  specialization: {
    type: String,
    default: "Gynaecologist & Obstetrician",
  },
  contact: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Doctor = mongoose.model("Doctor", doctorSchema);