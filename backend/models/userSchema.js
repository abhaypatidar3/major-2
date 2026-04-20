import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  emailaddress: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    minLength: [10, "Phone number must contain exact 10 digits"],
    maxLength: [10, "Phone number must contain exact 10 digits"],
  },
  age: {
    type: Number,
    required: true,
    min: [10, "Age must be at least 10"],
    max: [60, "Age must not exceed 60"],
  },
  city: {
    type: String,
    default: "",
  },
  lastPeriodStartDate: {
    type: Date,
  },
  avgCycleLength: {
    type: Number,
    min: [15, "Cycle length must be at least 15 days"],
    max: [60, "Cycle length must not exceed 60 days"],
  },
  periodDuration: {
    type: Number,
    min: [1, "Period duration must be at least 1 day"],
    max: [15, "Period duration must not exceed 15 days"],
  },
  cycleRegularity: {
    type: String,
    enum: ["Regular", "Irregular"],
  },
  Medical_Conditions: {
    type: [String],
    default: [],
  },
  currentMedications: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
