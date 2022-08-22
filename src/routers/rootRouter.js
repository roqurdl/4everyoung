import express from "express";
import { login, getJoin, postJoin } from "../controllers/userController";
import { home, search } from "../controllers/itemController";

const rootRouter = express.Router();

rootRouter.get(`/`, home);
rootRouter.get(`/search`, search);
rootRouter.get(`/login`, login);
rootRouter.route(`/join`).get(getJoin).post(postJoin);
export default rootRouter;
