"use server"
import Blog from "@/models/Blog";
import dbConnect from "./db";
import { revalidatePath } from "next/cache";

export const GetAllBlogs = async () => {
  try {
    await dbConnect();

    const AllBlogs = await Blog.find({}).populate("user", "-sig");

    return {
      status: "success",
      message: AllBlogs,
    };
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return {
      status: "error",
      message: "Failed to fetch blogs.",
    };
  }
};

export const GetBlogById = async (id: string) => {
  try {
    await dbConnect();

    const blog = await Blog.findById(id).populate("user comments", ).lean();

    return {
      status: "success",
      message: blog,
    };
  } catch (error) {
    console.log("Error fetching blog by ID:", error);
    return {
      status: "error",
      message: "Failed to fetch blog by ID.",
    };
  }
};

export const HandleCreateBlog = async (payload) => {
  try {
    await dbConnect();

    const newBlog = new Blog({
      title: payload.title,
      content: payload.content,
      description: payload.description,
      image: payload.thumbnail,
      user: payload.author,
      categories: payload.categories || [],
    });

    await newBlog.save();

    return { status: "success", message: newBlog._id };
  } catch (error) {
    console.log("Error creating user:", error);
    return { status: "failed", message: "Internal server error" };
  }
};

export const GetRecentBlog = async () => {
  try {
    await dbConnect();

    const recentBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("user", "-sig")
      .lean();


    return {
      status: "success",
      message: recentBlogs,
    };
  } catch (error) {
    console.log("Error fetching recent blogs:", error);
    return {
      status: "error",
      message: "Failed to fetch recent blogs.",
    };
  }
};

export const LikeBlog = async (blogId: string, userId: string) => {
  try {
    await dbConnect();

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        // Remove from dislikes
        $pull: { dislikes: userId },
        // Add to likes only if not present
        $addToSet: { likes: userId },
      },
      { new: true } // return updated document
    );

    revalidatePath("/")
    
  } catch (error) {
    console.log("Error liking blog:", error);
    return { status: "error", message: "Failed to like blog." };
  }
};

export const DislikeBlog = async (blogId: string, userId: string) => {
  try {
    await dbConnect();

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return { status: "error", message: "Blog not found" };
    }

    // Remove user from likes
    blog.likes = blog.likes.filter(
      (id) => id.toString() !== userId
    );

    // Add user to dislikes only if not already in dislikes
    if (!blog.dislikes.some((id) => id.toString() === userId)) {
      blog.dislikes.push(userId);
    }

    await blog.save();

    return { status: "success", message: blog.dislikes };
  } catch (error) {
    console.log("Error disliking blog:", error);
    return { status: "error", message: "Failed to dislike blog." };
  }
};

export const IncrementBlogViews = async (blogId: string, userId: string) => {
  try {
    await dbConnect();

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $addToSet: { views: userId } },
      { new: true } 
    );

    return { status: "success", message: updatedBlog.views};
  } catch (error) {
    console.log("Error incrementing blog views:", error);
    return { status: "error", message: "Failed to increment blog views." };
  }
};
