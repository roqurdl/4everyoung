import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import itemRouter from "./routers/itemRouter";
const app = express();
const LOGGER = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views/screens");

app.use(LOGGER);
app.use(express.urlencoded({ extended: true }));

app.use("/", rootRouter);
app.use("/items", itemRouter);

export default app;
