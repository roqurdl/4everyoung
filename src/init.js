import "./db";
import "./models/Item";
import app from "./server";

const PORT = 7000;

const handleListen = () => console.log(`http://localhost:${PORT}`);
app.listen(7000, handleListen);
