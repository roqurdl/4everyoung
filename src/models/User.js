import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  useSocial: { type: Boolean, default: false },
  username: { type: String, required: true, maxlenth: 15, unique: true },
  password: { type: String },
  name: { type: String, required: true },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("user", userSchema);
export default User;
