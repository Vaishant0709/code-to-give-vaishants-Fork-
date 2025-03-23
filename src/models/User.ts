import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  email: string;
  name: string;
  contactNumber: string;
  password: string;
  role: "student" | "teacher" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<Users>(
  {
    email: {
      type: String,
      unique: [true, "Email already in use"],
      index: true,
      required: [true, "Email missing"],
      lowercase: true,
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Invalid email",
      ],
    },
    contactNumber: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Name missing"],
      trim: true,
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
  },
  { timestamps: true }
);

export default (mongoose.models.User as mongoose.Model<Users>) || mongoose.model<Users>("User", UserSchema);
