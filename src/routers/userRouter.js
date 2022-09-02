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
  startGoogle,
  finishGoogle,
  startKakao,
  finishKakao,
  startNaver,
  finishNaver,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(`/logout`, logout);
userRouter.get(`/profile`, profile);
userRouter.get(`/github/start`, startGithub);
userRouter.get(`/github/finish`, finishGithub);
userRouter.get(`/kakao/start`, startKakao);
userRouter.get(`/kakao/finish`, finishKakao);
userRouter.get(`/naver/start`, startNaver);
userRouter.get(`/naver/finish`, finishNaver);
// userRouter.get(`/google/start`, startGoogle);
// userRouter.get(`/google/finish`, finishGoogle);
userRouter.route(`/edit`).get(getEdit).post(postEdit);
userRouter.route(`/change-password`).get(getPassword).post(postPassword);
userRouter.get(`/delete`, delUser);

export default userRouter;
