import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string; // social login does not need password
  avatar?: string;
  portfolioWebsite?: string;
  location?: string;
  bio?: string;
  reputation?: number;
  joinedAt: Date;
  savedPosts?: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  portfolioWebsite: { type: String },
  location: { type: String },
  bio: { type: String },
  reputation: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  savedPosts: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

const User = models.User || model<IUser>("User", UserSchema);
export default User;
