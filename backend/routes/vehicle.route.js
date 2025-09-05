import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { registerVehicle, getMyVehicles, getVehicle, deleteVehicle, updateVehicle } from "../controllers/vehicle.controller.js";
const router = express.Router();


/* USER ROUTES */
router.post("/register", protect, registerVehicle);
router.get("/get-my-vehicles", protect, getMyVehicles);

/* ADMIN ROUTES */
router.get("/get-vehicles", protect, isAdmin, getVehicle);
router.delete("/delete-vehicle/:id", protect, isAdmin, deleteVehicle);
router.put("/update-vehicle/:id", protect, isAdmin, updateVehicle);

export { router as vehicleRouter };