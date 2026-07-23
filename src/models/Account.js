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
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const id = ret._id;
        ret._links = {
          update: { href: `/api/accounts/${id}`, method: "PATCH" },
          delete: { href: `/api/accounts/${id}`, method: "DELETE" },
          create_transaction: {
            href: `/api/accounts/${id}/transactions`,
            method: "POST",
          },
          transactions: {
            href: `/api/accounts/${id}/transactions`,
            method: "GET",
          },
          pending_transactions: {
            href: `/api/accounts/${id}/transactions/pending`,
            method: "GET",
          },
        };
        return ret;
      },
    },
  }
);

cascadeDelete(accountSchema);

export default mongoose.model("Account", accountSchema);
