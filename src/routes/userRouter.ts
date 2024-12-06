import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userController";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);
userRouter.route("/loginUser").post(loginUser);

export default userRouter;
