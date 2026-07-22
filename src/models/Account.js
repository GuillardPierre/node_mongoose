import mongoose from "mongoose";
import cascadeDelete from "../middleware/cascadeDelete.js";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Account name is required"],
      maxlength: [50, "Account name cannot exceed 50 characters"],
      minlength: [1, "Account name must not be empty"],
    },
    user_id: {
      type: mongoose.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
  },
  { timestamps: true }
);

cascadeDelete(accountSchema);

export default mongoose.model("Account", accountSchema);
