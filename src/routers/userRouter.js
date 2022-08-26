import express from "express";
import {
  logout,
  startGithub,
  finishGithub,
  profile,
  getEdit,
  postEdit,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(`/logout`, logout);
userRouter.get(`/profile`, profile);
userRouter.get(`/github/start`, startGithub);
userRouter.get(`/github/finish`, finishGithub);
userRouter.route(`/edit`).get(getEdit).post(postEdit);

export default userRouter;
