import express from "express";
import {
  getUpload,
  postUpload,
  detail,
  getEdit,
  postEdit,
  deleteItem,
} from "../controllers/itemController";

const itemRouter = express.Router();

itemRouter.route("/upload").get(getUpload).post(postUpload);
itemRouter.get("/:id([0-9a-f]{24})", detail);
itemRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
itemRouter.get("/:id([0-9a-f]{24})/delete", deleteItem);

export default itemRouter;
