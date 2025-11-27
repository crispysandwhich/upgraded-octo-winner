import Blog from "@/models/Blog";
import dbConnect from "./db";

export const GetAllBlogs = async () => {
  try {
    await dbConnect();

    const AllBlogs = await Blog.find({}).populate("user").lean();

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

    const blog = await Blog.findById(id).populate("user").lean();

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
