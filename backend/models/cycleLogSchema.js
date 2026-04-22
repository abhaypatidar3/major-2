import mongoose from "mongoose";

const cycleLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    flow: {
      type: String,
      enum: ["none", "light", "medium", "heavy"],
      default: "none",
    },
    symptoms: {
      type: [String],
      default: [],
    },
    mood: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// one log per user per date
cycleLogSchema.index({ user: 1, date: 1 }, { unique: true });

export const CycleLog = mongoose.model("CycleLog", cycleLogSchema);
