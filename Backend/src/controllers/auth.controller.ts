import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "../utils/email";
import { generateOTP, generateToken, verifyOTP } from "../utils/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 1. Signup
export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existingUser.length > 0) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const otpCode = generateOTP();

  await db.insert(users).values({
    fullName,
    email,
    passwordHash,
    otpCode,
    otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
  });

  await sendEmail(
    email,
    "QuickCourt OTP Verification",
    `Your OTP is ${otpCode}`,
  );

  res.json({ message: "Signup successful. Check your email for OTP." });
};

// 2. Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await db.select().from(users).where(eq(users.email, email));
  if (!user[0] || !verifyOTP(otp, user[0].otpCode, user[0].otpExpiry)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await db
    .update(users)
    .set({ isVerified: true, otpCode: null, otpExpiry: null })
    .where(eq(users.email, email));

  res.json({ message: "Account verified successfully" });
};

// 3. Login (with 2FA check)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("LOGIN body:", req.body);

  const user = await db.select().from(users).where(eq(users.email, email));
  if (!user[0]) return res.status(400).json({ message: "Invalid credentials" });

  const validPassword = await bcrypt.compare(password, user[0].passwordHash);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid credentials" });

  if (user[0].twoFactorEnabled) {
    const otpCode = generateOTP();
    await db
      .update(users)
      .set({ otpCode, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) })
      .where(eq(users.email, email));

    await sendEmail(
      email,
      "QuickCourt Login OTP",
      `Your login OTP is ${otpCode}`,
    );
    return res.json({ message: "2FA OTP sent to email" });
  }

  const token = generateToken({ id: user[0].id, role: user[0].role }); // defaults to 3 days
  res.json({ token, twoFactorEnabled: user[0].twoFactorEnabled });
};

// 4. Verify 2FA
export const verify2FA = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await db.select().from(users).where(eq(users.email, email));
  console.log("VERIFY 2FA body:", req.body, "DB user:", user[0]);
  if (!user[0] || !verifyOTP(otp, user[0].otpCode, user[0].otpExpiry)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await db
    .update(users)
    .set({ otpCode: null, otpExpiry: null })
    .where(eq(users.email, email));

  const token = generateToken({ id: user[0].id, role: user[0].role }); // defaults to 3 days
  res.json({ token });
};

// 5. Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await db.select().from(users).where(eq(users.email, email));
  if (!user[0]) return res.status(400).json({ message: "No account found" });

  const resetToken = generateToken({ id: user[0].id }, "15m"); // 15 mins expiry
  await db
    .update(users)
    .set({
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
    })
    .where(eq(users.email, email));

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(
    email,
    "QuickCourt Password Reset",
    `Click to reset password: ${resetLink}`,
  );

  res.json({ message: "Password reset link sent to email" });
};

// 6. Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(eq(users.id, decoded.id));

    res.json({ message: "Password updated successfully" });
  } catch {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// 7. Toggle Two-Factor (email OTP based)
export const toggleTwoFactor = async (req: Request, res: Response) => {
  // auth middleware attaches user
  // @ts-ignore
  const authUser = req.user as { id: number };
  if (!authUser) return res.status(401).json({ message: "Unauthorized" });

  const { enable } = req.body as { enable: boolean };

  await db
    .update(users)
    .set({ twoFactorEnabled: enable })
    .where(eq(users.id, authUser.id));

  res.json({ message: `Two-factor ${enable ? "enabled" : "disabled"}` });
};

// 8. Get current 2FA status
export const getTwoFactorStatus = async (req: Request, res: Response) => {
  // @ts-ignore
  const authUser = req.user as { id: number };
  if (!authUser) return res.status(401).json({ message: "Unauthorized" });

  const u = await db.select({ twoFactorEnabled: users.twoFactorEnabled }).from(users).where(eq(users.id, authUser.id));
  res.json({ twoFactorEnabled: u[0]?.twoFactorEnabled ?? false });
};
