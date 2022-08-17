import express from "express";
import morgan from "morgan";
const app = express();
const PORT = 7000;
const LOGGER = morgan("dev");

app.set("veiw engine", "pug");
app.set("veiws", __dirname + "/src/views");

app.use(LOGGER);

const handleListen = () => console.log(`http://localhost:${PORT}`);
app.listen(7000, handleListen);
