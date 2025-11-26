import mongoose from "mongoose";

export interface IBlog {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  image: string;
  description: string;  
}

// TODO: Make it better......

const BlogSchema = new mongoose.Schema<IBlog>(
  {
    user: {
      type: "ObjectId",
    },
    title: {
      type: String
    },
    content: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    }
  },
  { timestamps: true }
);

let BlogModel: mongoose.Model<IBlog>;

try {
  // Try to retrieve an existing model
  BlogModel = mongoose.model<IBlog>("Blog");
} catch (e) {
  // If the model doesn't exist, define it
  BlogModel = mongoose.model<IBlog>("Blog", BlogSchema);
}

export const Blog = BlogModel;