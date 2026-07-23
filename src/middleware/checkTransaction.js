import Transaction from "../models/Transaction.js";

const checkTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId,
    ).populate("account_id");

    if (!transaction || !transaction.account_id) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (
      transaction.account_id._id.toString() !== req.params.accountId ||
      transaction.account_id.user_id.toString() !== req.userId.toString()
    ) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.locals.transaction = transaction;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid transaction id" });
  }
};

export default checkTransaction;
