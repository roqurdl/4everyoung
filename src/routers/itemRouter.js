import express from "express";
import { getUpload, postUpload } from "../controllers/itemController";

const itemRouter = express.Router();

itemRouter.route("/upload").get(getUpload).post(postUpload);

export default itemRouter;
