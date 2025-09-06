import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getCurrentCongestion, } from "../controllers/congestion.controller.js";
const router = express.Router();

router.use(protect);
router.get("/current", getCurrentCongestion);
router.get("/stats",getCongestionStats);

export { router as congestionRouter };