import { Document, model, models, ObjectId, Schema } from "mongoose";
import argon2 from "argon2";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

// Pre-save hook: Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

export const User = models.User || model<IUser>("users", userSchema);
