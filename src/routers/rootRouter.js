import express from "express";
import { login, event } from "../controllers/userController";
import { home, search } from "../controllers/itemController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.get("/login", login);
rootRouter.get("/event", event);

export default rootRouter;
