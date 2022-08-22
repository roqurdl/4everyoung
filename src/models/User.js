import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, maxlenth: 15, unique: true },
  password: { type: String },
  name: { type: String, required: true },
});
const User = mongoose.model("user", userSchema);
export default User;
