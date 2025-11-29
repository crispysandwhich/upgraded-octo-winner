"use server";

import dbConnect from "./db";
import Comment from "@/models/Comment";
import Blog from "@/models/Blog";
import { revalidatePath } from "next/cache";

export const UploadComment = async (payload) => {
  const { blogId, userId, content, path } = payload;

  try {
    await dbConnect();


    // 1. Create comment
    const comment = new Comment({
      user: userId,
      blog: blogId,
      text: content,
    });

    await comment.save();

    // 2. Push into Blog.comments[]
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: comment._id },
    });
    
    if (path === "/") {
      revalidatePath(path);
    } else {
        revalidatePath(`/blogs/${blogId}`);
    }


    return {
      status: "success",
      message: "Comment uploaded successfully."
    };
  } catch (error) {
    console.log("Error uploading comment:", error);
    return {
      status: "error",
      message: "Failed to upload comment.",
    };
  }
};


export const GetBlogComments = async (blogId: string) => {
    try {
      await dbConnect();
  
      const comments = await Comment.find({ blog: blogId })
        .sort({ createdAt: -1 })
        .limit(15)
        .populate({
          path: "user",
          select: "-sig -password",
        })
        .lean();
  
      return {
        status: "success",
        message: comments,
      };
    } catch (error) {
      console.log("Error fetching comments:", error);
      return {
        status: "error",
        message: "Failed to fetch comments.",
      };
    }
  };
  