import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/4ey");

const db = mongoose.connection;

const dbConnect = () => console.log("*****DB CONNECT*****");
const dbError = (error) => console.log(":::::DB ERROR:::::", error);

db.on("error", dbError);
db.once("open", dbConnect);
