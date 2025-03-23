import { z } from "zod";

export default z
  .object({
    email: z.string().email({
      message: "Invalid Email",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 character")
      .max(64, "Password cannot be more than 64 characters")
      .regex(/^(?=.*\d).*$/, "Password must contain at least 1 digit")
      .regex(/^(?=.*[a-z]).*$/, "Password must contain at least 1 lowercase character")
      .regex(/^(?=.*[A-Z]).*$/, "Password must contain at least 1 uppercase character"),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });
