import mongoose from "mongoose";
import Account from "../models/Account.js";

export const getAll = async (req, res) => {
  try {
    const accounts = await Account.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(req.userId) } },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "account_id",
          as: "transactions",
        },
      },
      {
        $addFields: {
          balance: {
            $sum: {
              $map: {
                input: "$transactions",
                as: "transaction",
                in: {
                  $cond: [
                    { $eq: ["$$transaction.type", "credit"] },
                    "$$transaction.amount",
                    { $multiply: ["$$transaction.amount", -1] },
                  ],
                },
              },
            },
          },
          transactionCount: { $size: "$transactions" },
        },
      },
      { $project: { transactions: 0 } },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({
      count: accounts.length,
      accounts: accounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Account name is required" });
    }

    const account = new Account({
      name: name.trim(),
      user_id: req.userId,
    });

    await account.save();

    res.status(201).json({
      message: "Account created successfully",
      account: account,
    });
  } catch (error) {
    if (error.errors) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const accountId = new mongoose.Types.ObjectId(req.params.accountId);
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Account name is required" });
    }

    const account = await Account.findOneAndUpdate(
      { _id: accountId, user_id: req.userId },
      { name: name.trim() },
      { new: true, runValidators: true },
    );

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({
      message: "Account updated successfully",
      account: account,
    });
  } catch (error) {
    if (error.errors) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const accountId = new mongoose.Types.ObjectId(req.params.accountId);

    const account = await Account.findOneAndDelete({
      _id: accountId,
      user_id: req.userId,
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({
      message: "Account and all associated transactions deleted successfully",
      deletedAccount: account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAll,
  create,
  update,
  delete: deleteAccount,
};
