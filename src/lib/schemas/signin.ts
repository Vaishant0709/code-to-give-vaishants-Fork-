import { z } from "zod";

export default z.object({
  email: z.string().email({
    message: "Invalid Email",
  }),
  password: z.string().min(8, "Password must be at least 8 character").max(64, "Password cannot be more than 64 characters"),
});
