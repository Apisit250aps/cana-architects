import { Document, model, models, ObjectId, Schema } from "mongoose";
import argon2 from "argon2";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  authenticate(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
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

// Method: Authenticate user password
userSchema.methods.authenticate = async function (password: string): Promise<boolean> {
  return await argon2.verify(this.password, password);
};

export const User = models.users || model<IUser>("users", userSchema);