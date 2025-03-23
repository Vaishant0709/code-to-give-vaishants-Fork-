import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<Users>({
  email: {
    type: String,
    unique: [true, "email already in use"],
    index: true,
    required: [true, "email missing"],
  },
  password: {
    type: String,
    required: [true, "password missing"],
  },
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);
