import express from "express";
import { getUpload } from "../controllers/itemController";

const itemRouter = express.Router();

itemRouter.route("/upload").get(getUpload);

export default itemRouter;
