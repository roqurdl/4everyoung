import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  itemUrl: { type: String, required: true },
  infoUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 2 },
  createdAt: { type: Date, required: true, default: Date.now },
  cost: { type: String, required: true, trim: true },
});
