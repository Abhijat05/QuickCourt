import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// JWT token generator (defaults to 3 days expiry)
export const generateToken = (
  payload: Record<string, unknown>,
  expiresIn: string = "3d",
): string => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET, options);
};

// OTP generator (6-digit numeric code)
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOTP = (
  providedOtp: string,
  storedOtp: string | null,
  expiry: Date | null,
): boolean => {
  if (!storedOtp || !expiry) return false;
  if (providedOtp !== storedOtp) return false;
  if (new Date() > expiry) return false;
  return true;
};
