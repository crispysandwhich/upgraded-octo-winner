"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { DislikeBlog, IncrementBlogViews, LikeBlog } from "../lib/BlogFunc";
import BlogComments from "./BlogComments";
import { usePathname } from "next/navigation";

interface SingleBlogDispProps {
  blog: any;
  session: any;
  comments: any;
}

const SingleBlogDisp = ({ blog, session, comments }: SingleBlogDispProps) => {
  const blogData = JSON.parse(blog).message;
  const userSession = JSON.parse(session);
  const pathname = usePathname();

  const [likes, setLikes] = useState<number>(blogData.likes.length ?? 0);
  const [dislikes, setDislikes] = useState<number>(
    blogData.dislikes.length ?? 0
  );
  const [views, setViews] = useState<number>(blogData.views.length ?? 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);

  useEffect(() => {
    const x = async() => {
      await IncrementBlogViews(blogData._id, userSession.userId);
    }
    if (blogData.isLoggedIn) {
      x()
      setViews((v) => v + 1);
    } else {
      setViews((v) => v + 1);
    }
  }, []);

  const handleLike = async () => {
    if (userSession.isLoggedIn) {
      await LikeBlog(blogData._id, userSession.userId);
      setLikes((l) => l + 1);
      setDislikes((d) => d - 1);
    } else {
      toast.info("Please log in to like the blog.");
    }
  };

  const handleDislike = async () => {
    if (userSession.isLoggedIn) {
      await DislikeBlog(blogData._id, userSession.userId);
      setDislikes((d) => d + 1);
      setLikes((l) => l - 1);
    } else {
      toast.info("Please log in to like the blog.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#0F1115] rounded-xl shadow-lg text-gray-200">
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-3xl font-bold mb-2 text-white">{blogData.title}</h2>
        <p className="text-gray-400 text-lg">{blogData.description}</p>
      </header>

      {/* Image */}
      {blogData.image && (
        <div className="relative w-full h-[300px] sm:h-[420px] md:h-[520px] mb-6 rounded-lg overflow-hidden border border-gray-700">
          <Image src={blogData.image} alt="blog image" fill unoptimized />
          <div className="absolute inset-0 bg-black/20" aria-hidden />
        </div>
      )}

      {/* Stats: likes / dislikes / views */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-gray-800 rounded-md px-2 py-1 shadow-sm">
            <button
              onClick={handleLike}
              aria-label="Like post"
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition ${
                liked
                  ? "bg-blue-600 text-white"
                  : "text-gray-200 hover:bg-gray-700"
              }`}
            >
              👍 <span className="ml-1">{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              aria-label="Dislike post"
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition ${
                disliked
                  ? "bg-red-600 text-white"
                  : "text-gray-200 hover:bg-gray-700"
              }`}
            >
              👎 <span className="ml-1">{dislikes}</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-200">
              👁️ <span className="ml-1">{views}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Published:{" "}
          {new Date(
            blogData.createdAt ?? blogData.publishedAt ?? Date.now()
          ).toLocaleDateString()}
        </div>
      </div>

      {/* Tags */}
      {Array.isArray(blogData.categories) && blogData.categories.length > 0 && (
        <ul className="flex gap-2 mt-2 mb-6 flex-wrap">
          {blogData.categories.map((cat: string) => (
            <li
              key={cat}
              className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded"
            >
              {cat}
            </li>
          ))}
        </ul>
      )}

      {/* Content */}
      <p className="leading-relaxed text-gray-300 text-lg mb-6">
        {blogData.content}
      </p>


      <BlogComments 
        userSession={userSession} 
        blogId={blogData._id}
        comments={comments}
        path={pathname}
        />
    </div>
  );
};

export default SingleBlogDisp;
