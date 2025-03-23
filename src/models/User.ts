import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  email: string;
  name: string;
  contactNum?: string;
  password: string;
  role: "student" | "teacher" | "admin";
}

const UserSchema = new mongoose.Schema<Users>({
  email: {
    type: String,
    unique: [true, "Email already in use"],
    index: true,
    required: [true, "Email missing"],
  },
  contactNum: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Name missing"],
  },
  password: {
    type: String,
    required: [true, "Password missing"],
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
    required: true,
  },
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);
