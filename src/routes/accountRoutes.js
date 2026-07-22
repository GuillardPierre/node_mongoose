import express from "express";
import accountController from "../controllers/accountController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.post("/", accountController.create);

router.get("/", accountController.getAll);

router.patch("/:accountId", accountController.update);

router.delete("/:accountId", accountController.delete);

export default router;
