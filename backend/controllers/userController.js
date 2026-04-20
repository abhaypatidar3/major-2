import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { username, firstname, lastname, password, emailaddress, phone, age } =
    req.body;

  if (
    !username ||
    !password ||
    !emailaddress ||
    !age ||
    !phone ||
    !firstname ||
    !lastname
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const isRegistered = await User.findOne({
    $or: [{ emailaddress }, { username }],
  });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        "User already registered with this email or username",
        400,
      ),
    );
  }

  const user = await User.create({
    username,
    password,
    emailaddress,
    phone,
    age,
    firstname,
    lastname,
  });

  generateToken(user, "User registered successfully", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorHandler("Please provide username and password", 400));
  }

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid username or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid username or password", 401));
  }

  generateToken(user, "Logged in successfully", 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const {
    city,
    lastPeriodStartDate,
    avgCycleLength,
    periodDuration,
    cycleRegularity,
    Medical_Conditions,
    currentMedications,
  } = req.body;

  const updatedFields = {};

  if (city !== undefined) updatedFields.city = String(city).trim();
  if (lastPeriodStartDate !== undefined && lastPeriodStartDate !== "") {
    updatedFields.lastPeriodStartDate = lastPeriodStartDate;
  }
  if (avgCycleLength !== undefined && avgCycleLength !== "") {
    updatedFields.avgCycleLength = Number(avgCycleLength);
  }
  if (periodDuration !== undefined && periodDuration !== "") {
    updatedFields.periodDuration = Number(periodDuration);
  }
  if (cycleRegularity !== undefined && cycleRegularity !== "") {
    updatedFields.cycleRegularity = cycleRegularity;
  }
  if (Medical_Conditions !== undefined && Array.isArray(Medical_Conditions)) {
    const seen = new Set();
    updatedFields.Medical_Conditions = Medical_Conditions.map((d) =>
      String(d).trim(),
    )
      .filter((d) => d.length > 0)
      .filter((d) => {
        const key = d.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 50);
  }
  if (currentMedications !== undefined) {
    updatedFields.currentMedications =
      currentMedications === true || currentMedications === "true";
  }

  const user = await User.findByIdAndUpdate(req.user._id, updatedFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
