import { Router } from "express";
import { addNewTrain, loginUser, registerUser } from "../controllers/userController";
import { verifyToken } from "../middleware/userMiddleware";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);
userRouter.route("/loginUser").post(loginUser);
userRouter.route("/addNewTrain").post(verifyToken, addNewTrain);

export default userRouter;
