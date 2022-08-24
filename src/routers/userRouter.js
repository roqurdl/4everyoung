import express from "express";
import {
  logout,
  startGithub,
  finishGithub,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(`/logout`, logout);
userRouter.get(`/github/start`, startGithub);
userRouter.get(`/github/finish`, finishGithub);

export default userRouter;
