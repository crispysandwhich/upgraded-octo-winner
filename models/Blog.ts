import mongoose from "mongoose";

export interface IBlog {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  description: string;  
  categories?: string[];
  likes?: mongoose.Types.ObjectId[];
  dislikes?: mongoose.Types.ObjectId[];
  comments?: mongoose.Types.ObjectId[];
  views?: mongoose.Types.ObjectId[];
  notLoggedViews?: number;
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
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    views: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    notLoggedViews: {
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