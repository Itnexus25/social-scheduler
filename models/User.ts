import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Define the User schema interface for type safety
export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// ✅ Define the User schema
const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving the user
userSchema.pre<IUser>("save", async function (next: CallbackWithoutResultAndOptionalError) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    console.error("❌ Error hashing password:", error);
    next(error);
  }
});

// ✅ Compare entered password with hashed password
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error: any) {
    console.error("❌ Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};

// ✅ Create & export the User model. Use an existing model if registered.
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;