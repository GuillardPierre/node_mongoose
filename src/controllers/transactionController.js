import Transaction from "../models/Transaction.js";

const getBalance = (transactions) => {
  let balance = 0;
  for (const transaction of transactions) {
    balance +=
      transaction.type === "credit" ? transaction.amount : -transaction.amount;
  }
  return balance;
};

export const add = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      account_id: res.locals.account._id,
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction,
    });
  } catch (error) {
    if (error.errors) {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: error.message });
  }
};

export const list = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      account_id: res.locals.account._id,
    });
    const balance = getBalance(transactions);

    res.json({ count: transactions.length, transactions, balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const transaction = res.locals.transaction;
    const {
      label,
      type,
      amount,
      date,
      payment_method,
      is_pending,
      category,
    } = req.body;

    if (label !== undefined) transaction.label = label;
    if (type !== undefined) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (date !== undefined) transaction.date = date;
    if (payment_method !== undefined) transaction.payment_method = payment_method;
    if (is_pending !== undefined) transaction.is_pending = is_pending;
    if (category !== undefined) transaction.category = category;

    await transaction.save();

    res.json({
      message: "Transaction updated successfully",
      transaction: transaction,
    });
  } catch (error) {
    if (error.errors) {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const transaction = res.locals.transaction;
    await transaction.deleteOne();

    res.json({
      message: "Transaction deleted successfully",
      transaction: transaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pending = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      account_id: res.locals.account._id,
      is_pending: true,
    });

    res.json({ count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const populated = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      account_id: res.locals.account._id,
    }).populate("account_id");

    res.json({ count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { add, list, update, remove, pending, populated };
