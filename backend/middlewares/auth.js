import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});

export const isAuthorized = (...emails) => {
  return (req, res, next) => {
    if (!emails.includes(req.user.emailaddress)) {
      return next(
        new ErrorHandler(
          `${req.user.emailaddress} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
