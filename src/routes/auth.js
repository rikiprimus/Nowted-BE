import express from "express";
const router = express.Router();
import AuthController from "../controllers/auth.controller.js";

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/verify', AuthController.verifyotp)
router.post('/forgotpassword', AuthController.forgotpassword)
router.post('/newpassword', AuthController.newpassword)

export default router