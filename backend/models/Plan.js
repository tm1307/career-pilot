import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    goal:   { type: String, required: true },
    level:  { type: String },
    steps:  [String],
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
