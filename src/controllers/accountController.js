import mongoose from "mongoose";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const getAll = async (req, res) => {
  try {
    const results = await Account.aggregate([
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

    const accounts = results.map((result) => {
      const account = Account.hydrate(result);
      account.set(
        { balance: result.balance, transactionCount: result.transactionCount },
        undefined,
        { strict: false },
      );
      return account;
    });

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
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Account name is required" });
    }

    const account = res.locals.account;
    account.name = name.trim();
    await account.save();

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
    const account = res.locals.account;
    await account.deleteOne();

    res.json({
      message: "Account and all associated transactions deleted successfully",
      deletedAccount: account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const globalBalance = async (req, res) => {
  try {
    const accounts = await Account.find({ user_id: req.userId });
    const accountIds = accounts.map((account) => account._id);

    const transactions = await Transaction.find({
      account_id: { $in: accountIds },
    });

    let balance = 0;
    for (const transaction of transactions) {
      balance +=
        transaction.type === "credit"
          ? transaction.amount
          : -transaction.amount;
    }

    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAll,
  create,
  update,
  delete: deleteAccount,
  globalBalance,
};
