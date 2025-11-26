import { z } from "zod";

export const UserRequestLoginSchema = z.object({
  emailOrUsername: z.string().min(4),
  password: z.string().min(6),
});

export type UserRequestLoginItem = z.infer<typeof UserRequestLoginSchema>;

// Register request schema (matches the DTO you provided)
export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  userName: z.string().min(3),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
