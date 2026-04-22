import { CycleLog } from "../models/cycleLogSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

// POST /api/v1/cycle/log
// Save or update a day's log (upsert — if same date exists, update it)
export const saveCycleLog = catchAsyncErrors(async (req, res, next) => {
  const { date, flow, symptoms, mood, notes } = req.body;

  if (!date) {
    return next(new ErrorHandler("Date is required.", 400));
  }

  // Normalise to midnight so time doesn't cause duplicate issues
  const logDate = new Date(date);
  logDate.setHours(0, 0, 0, 0);

  const log = await CycleLog.findOneAndUpdate(
    { user: req.user._id, date: logDate },
    { flow, symptoms, mood, notes },
    { upsert: true, new: true, runValidators: true },
  );

  res.status(200).json({ success: true, log });
});

// GET /api/v1/cycle/logs
// Get last 6 months of logs for the calendar
export const getCycleLogs = catchAsyncErrors(async (req, res, next) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const logs = await CycleLog.find({
    user: req.user._id,
    date: { $gte: sixMonthsAgo },
  }).sort({ date: 1 });

  res.status(200).json({ success: true, logs });
});

// DELETE /api/v1/cycle/log/:id
export const deleteCycleLog = catchAsyncErrors(async (req, res, next) => {
  const log = await CycleLog.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!log) {
    return next(new ErrorHandler("Log not found.", 404));
  }

  await log.deleteOne();
  res.status(200).json({ success: true, message: "Log deleted." });
});
