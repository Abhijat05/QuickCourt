import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  signupSchema,
  loginSchema,
  toggle2FASchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validators";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// Signup & account verification
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/verify-otp", authController.verifyOtp);

// Login & 2FA verify
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-2fa", authController.verify2FA);

// 2FA toggle & status (protected)
router.post(
  "/2fa/toggle",
  auth,
  validate(toggle2FASchema),
  authController.toggleTwoFactor,
);
router.get("/2fa/status", auth, authController.getTwoFactorStatus);

// Password reset
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
