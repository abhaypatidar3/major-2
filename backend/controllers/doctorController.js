import { Doctor } from "../models/Doctor.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";


export const getDoctors = catchAsyncErrors(async (req, res, next) => {
  const city = req.query.city?.trim();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!city) {
    return next(new ErrorHandler("Please provide a city name", 400));
  }

  const query = { city: { $regex: new RegExp(`^${city}$`, "i") } };

  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .sort({ rating: -1 }) 
      .skip(skip)
      .limit(limit),
    Doctor.countDocuments(query),
  ]);

  if (!doctors || doctors.length === 0) {
    return next(new ErrorHandler(`No gynaecologists found in ${city}`, 404));
  }

  res.status(200).json({
    success: true,
    source: "database",
    city,
    count: doctors.length,
    pagination: {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    },
    doctors,
  });
});