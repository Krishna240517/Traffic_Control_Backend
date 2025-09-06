import express from "express";
import { getMyFines, issueFine, listFines, updateFine,getDailyFines, getRecentFines, getViolationTypes } from "../controllers/fine.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
const router = express.Router();

/* ADMIN ROUTES */
router.post("/issue", protect, isAdmin, issueFine); 
router.get("/list", protect, isAdmin, listFines); 
router.put("/:fineId", protect, isAdmin, updateFine);
router.get("/stats/daily", getDailyFines);
router.get("/stats/types", getViolationTypes);
router.get("/recent", getRecentFines);

/* USER ROUTES */
router.get("/my-fines", protect, getMyFines); 
router.post("/pay/:fineId", protect); //todo: payment gateway required




export { router as fineRouter };