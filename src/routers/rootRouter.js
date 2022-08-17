import express from "express";
import { home, search, login, event } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.get("/login", login);
rootRouter.get("/event", event);

export default rootRouter;
