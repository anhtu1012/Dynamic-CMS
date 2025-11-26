import { z } from "zod";

// Response-specific user profile schema (uses `id` instead of `_id` and includes avatar)
export const userProfileResponseSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  userName: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().default(true),
  avatar: z.string().url().optional(),
  points: z.number().default(0),
  walletBalance: z.number().default(0),
  lastLogin: z.string().optional(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  userProfile: userProfileResponseSchema,
  expiresIn: z.number().int(),
});

// Register response example: message + userProfile
export const registerResponseSchema = z.object({
  message: z.string().optional(),
  userProfile: userProfileResponseSchema,
});

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
