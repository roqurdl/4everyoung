import express from "express";
import { getUpload, postUpload, detail } from "../controllers/itemController";

const itemRouter = express.Router();

itemRouter.route("/upload").get(getUpload).post(postUpload);
itemRouter.route("/:id([0-9a-f]{24})").get(detail);

export default itemRouter;
