import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
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
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localMiddle);
app.use("/", rootRouter);
app.use("/items", itemRouter);
app.use("/users", userRouter);

export default app;
