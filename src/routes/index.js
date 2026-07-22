import express from "express";
import authRoutes from "./authRoutes.js";
import accountRoutes from "./accountRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/accounts", accountRoutes);

export default router;
