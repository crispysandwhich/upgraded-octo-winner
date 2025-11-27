import mongoose from "mongoose";

export interface IBlog {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  description: string;  
  categories?: string[];
  likes?: number;
  dislikes?: number;
  comments?: mongoose.Types.ObjectId[];
}

// Make it better

const BlogSchema = new mongoose.Schema<IBlog>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    categories: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);