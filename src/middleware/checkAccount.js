import Account from "../models/Account.js";

const checkAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      user_id: req.userId,
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.locals.account = account;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid account id" });
  }
};

export default checkAccount;
