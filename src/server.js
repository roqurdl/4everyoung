import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import itemRouter from "./routers/itemRouter";
import userRouter from "./routers/userRouter";
import { localMiddle } from "./middelwares";
const app = express();
const LOGGER = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views/screens");

app.use(LOGGER);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(localMiddle);
app.use("/", rootRouter);
app.use("/items", itemRouter);
app.use("/users", userRouter);

export default app;
