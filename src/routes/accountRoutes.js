import express from "express";
import accountController from "../controllers/accountController.js";
import transactionController from "../controllers/transactionController.js";
import auth from "../middleware/auth.js";
import checkAccount from "../middleware/checkAccount.js";
import checkTransaction from "../middleware/checkTransaction.js";

const router = express.Router();

router.use(auth);

router.get("/global-balance", accountController.globalBalance);

router.post("/", accountController.create);

router.get("/", accountController.getAll);

router.patch("/:accountId", checkAccount, accountController.update);

router.delete("/:accountId", checkAccount, accountController.delete);

router.post(
  "/:accountId/transactions",
  checkAccount,
  transactionController.add,
);

router.get(
  "/:accountId/transactions",
  checkAccount,
  transactionController.list,
);

router.get(
  "/:accountId/transactions/pending",
  checkAccount,
  transactionController.pending,
);

router.get(
  "/:accountId/transactions/populated",
  checkAccount,
  transactionController.populated,
);

router.put(
  "/:accountId/transactions/:transactionId",
  checkTransaction,
  transactionController.update,
);

router.delete(
  "/:accountId/transactions/:transactionId",
  checkTransaction,
  transactionController.remove,
);

export default router;
