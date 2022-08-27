import express from "express";
import {
  logout,
  startGithub,
  finishGithub,
  profile,
  getEdit,
  postEdit,
  getPassword,
  postPassword,
  delUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(`/logout`, logout);
userRouter.get(`/profile`, profile);
userRouter.get(`/github/start`, startGithub);
userRouter.get(`/github/finish`, finishGithub);
userRouter.route(`/edit`).get(getEdit).post(postEdit);
userRouter.route(`/change-password`).get(getPassword).post(postPassword);
userRouter.get(`/delete`, delUser);

export default userRouter;
