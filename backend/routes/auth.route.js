import express from "express";
import { signup,login,logout,profile } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/profile",protect,profile);

export { router as authRouter};