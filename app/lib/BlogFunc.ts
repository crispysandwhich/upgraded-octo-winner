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

export const HandleCreateBlog = async (payload:any) => {
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

export const LikeBlog = async (blogId: string, userId: string, path: string) => {
  try {
    await dbConnect();

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return { status: "error", message: "Blog not found" };
    }

    const alreadyLiked = blog.likes.some((id:any) => id.toString() === userId);
    const alreadyDisliked = blog.dislikes.some((id:any) => id.toString() === userId);

    let updateQuery: any = {};

    if (alreadyLiked) {
      // 🔹 Case 1: User already liked → UNLIKE
      updateQuery = { $pull: { likes: userId } };
    } else {
      // 🔹 Case 2: User disliked → remove dislike + add like
      // 🔹 Case 3: User neutral → add like
      updateQuery = {
        $pull: { dislikes: userId },   
        $addToSet: { likes: userId },  
      };
    }

    await Blog.findByIdAndUpdate(blogId, updateQuery, { new: true });

    // Revalidate UI
    if (path === "/") revalidatePath("/");
    revalidatePath(path);

    return {
      status: "success",
      message: alreadyLiked
        ? "Like removed"
        : "Blog liked (dislike removed if present)",
    };
  } catch (error) {
    console.log("Error liking blog:", error);
    return { status: "error", message: "Failed to like blog." };
  }
};



export const DislikeBlog = async (blogId: string, userId: string, path: string) => {
  try {
    await dbConnect();

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return { status: "error", message: "Blog not found" };
    }

    const alreadyDisliked = blog.dislikes.some((id:any) => id.toString() === userId);
    const alreadyLiked = blog.likes.some((id:any) => id.toString() === userId);

    let updateQuery: any = {};

    if (alreadyDisliked) {
      // 🔹 User already disliked → remove dislike
      updateQuery = { $pull: { dislikes: userId } };
    } else {
      // 🔹 User liked → remove like + add dislike
      // 🔹 User neutral → just add dislike
      updateQuery = {
        $pull: { likes: userId },        // remove like if exists
        $addToSet: { dislikes: userId }, // add dislike
      };
    }

    await Blog.findByIdAndUpdate(blogId, updateQuery, { new: true });

    // Revalidate UI paths
    if (path === "/") revalidatePath("/");
    revalidatePath(path);

    return {
      status: "success",
      disliked: !alreadyDisliked,
      message: alreadyDisliked
        ? "Dislike removed"
        : "Blog disliked (like removed if present)",
    };
  } catch (error) {
    console.log("Error disliking blog:", error);
    return { status: "error", message: "Failed to dislike blog." };
  }
};

// TODO:: Make a single function for both logged in and not logged in views

export const IncrementBlogViews = async (blogId: string, userId: string, path: string) => {
  try {
    await dbConnect();

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $addToSet: { views: userId } },
      { new: true } 
    );

    if (path === "/") revalidatePath("/");
    revalidatePath(path);

    return { status: "success", message: updatedBlog.views};
  } catch (error) {
    console.log("Error incrementing blog views:", error);
    return { status: "error", message: "Failed to increment blog views." };
  }
};


export const LogViews = async (blogId: string, path: string) => {
  try {
    await dbConnect()

    await Blog.findByIdAndUpdate(blogId, { $inc: { notLoggedViews: 1 } }, { new: true });

    if (path === "/") revalidatePath("/");
    revalidatePath(path);

  } catch (error) {
    console.log("Error logging views:", error);
    return { status: "error", message: "Failed to log views." };
  }
}
