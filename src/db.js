import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const dbConnect = () => console.log("*****DB CONNECT*****");
const dbError = (error) => console.log(":::::DB ERROR:::::", error);

db.on("error", dbError);
db.once("open", dbConnect);
