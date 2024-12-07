import { Router } from "express";
import {
  addNewTrain,
  bookSeat,
  getBookingDetails,
  getTrainsFromSourceToDest,
  loginUser,
  registerUser
}
  from "../controllers/userController";
import { verifyToken } from "../middleware/userMiddleware";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);
userRouter.route("/loginUser").post(loginUser);
userRouter.route("/addNewTrain").post(verifyToken, addNewTrain);
userRouter.route("/getTrainsFromSourceToDest").post(verifyToken, getTrainsFromSourceToDest);
userRouter.route("/bookSeat").post(verifyToken, bookSeat);
userRouter.route("/getBookingDetails").post(verifyToken, getBookingDetails);

export default userRouter;
