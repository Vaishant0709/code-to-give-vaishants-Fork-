import { z } from "zod";

export default z.object({
  email: z
    .string()
    .email({
      message: "Invalid email",
    })
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});
