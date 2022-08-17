import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
const app = express();
const PORT = 7000;
const LOGGER = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views/screens");

app.use(LOGGER);

app.use("/", rootRouter);

const handleListen = () => console.log(`http://localhost:${PORT}`);
app.listen(7000, handleListen);
