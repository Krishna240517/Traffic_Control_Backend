import express from "express";
import { createTransaction, getUserTransactions, getAllTransactions, getParticularTransaction, updateTransaction } from "../controllers/transaction.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
const router = express.Router();

router.post("/create-transaction", protect, createTransaction);
router.get("/get-user-transactions/:userId",protect, getUserTransactions);
router.get("/get-transaction/:tranId",protect, getParticularTransaction);
router.patch("/update-transaction/:transId",protect, isAdmin, updateTransaction);
router.get("/get-all-transactions",protect, isAdmin, getAllTransactions);

export { router as transactionRouter };