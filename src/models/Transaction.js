import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Transaction label is required"],
      minlength: [2, "Label must be at least 2 characters"],
      maxlength: [50, "Label cannot exceed 50 characters"],
    },
    type: {
      type: String,
      enum: {
        values: ["credit", "debit"],
        message: "Type must be either 'credit' or 'debit'",
      },
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    payment_method: {
      type: String,
      enum: {
        values: ["Credit Card", "Direct Deposit", "Cash", "Bank Transfer"],
        message:
          "Payment method must be one of: Credit Card, Direct Deposit, Cash, Bank Transfer",
      },
      required: [true, "Payment method is required"],
    },
    is_pending: {
      type: Boolean,
      required: [true, "Pending status is required"],
      default: false,
    },
    category: {
      type: String,
      enum: {
        values: ["Food", "Income", "Shopping", "Housing", "Travel"],
        message:
          "Category must be one of: Food, Income, Shopping, Housing, Travel",
      },
      required: [true, "Category is required"],
    },
    account_id: {
      type: mongoose.ObjectId,
      ref: "Account",
      required: [true, "Account ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        let accountId = ret.account_id;
        if (ret.account_id && ret.account_id._id) {
          accountId = ret.account_id._id;
        }
        ret._links = {
          update: {
            href: `/api/accounts/${accountId}/transactions/${ret._id}`,
            method: "PUT",
          },
          delete: {
            href: `/api/accounts/${accountId}/transactions/${ret._id}`,
            method: "DELETE",
          },
        };
        return ret;
      },
    },
  }
);

export default mongoose.model("Transaction", transactionSchema);
