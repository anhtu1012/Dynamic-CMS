import { z } from "zod";

// Minimal wallet transaction schema — extend as needed
export const walletTransactionSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  amount: z.number().optional(),
  date: z.string().optional(),
  meta: z.any().optional(),
});

// Minimal points history entry
export const pointsHistorySchema = z.object({
  id: z.string().optional(),
  points: z.number().optional(),
  reason: z.string().optional(),
  date: z.string().optional(),
});

// Main user schema based on the sample document you provided
export const userSchema = z.object({
  _id: z.string().min(1),
  email: z.string().email(),
  userName: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().default(true),
  points: z.number().default(0),
  walletBalance: z.number().default(0),
  walletTransactions: z.array(walletTransactionSchema).default([]),
  pointsHistory: z.array(pointsHistorySchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
  lastLogin: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;

// Helper schemas for common operations
export const createUserSchema = userSchema.omit({
  _id: true,
  __v: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});
export const updateUserSchema = createUserSchema.partial();

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
