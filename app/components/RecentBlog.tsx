"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { DislikeBlog, LikeBlog } from "../lib/BlogFunc";
import { usePathname } from "next/navigation";

interface RecentBlogProps {
  blog: any;
  session: any;
}

export default function RecentBlog({ blog, session }: RecentBlogProps) {
  const BlogData = JSON.parse(blog).message[0];
  const userSession = JSON.parse(session);

  const pathname = usePathname();

  const formattedDate = new Date(BlogData.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleLike = async () => {
    if (userSession.isLoggedIn) {
      await LikeBlog(BlogData._id, userSession.userId, pathname);
      // setLikes((l) => l + 1);
      // setDislikes((d) => d - 1);
    } else {
      toast.info("Please log in to like the blog.");
    }
  };

  const handleDislike = async () => {
    if (userSession.isLoggedIn) {
      await DislikeBlog(BlogData._id, userSession.userId, pathname);
    } else {
      toast.info("Please log in to like the blog.");
    }
  };

  return (
    <section className="mb-10">
      <article className="rounded-2xl bg-white shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition">
        {/* IMAGE */}
        <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px]">
          <Image
            src={BlogData.image || "/blogthumb.png"}
            alt={BlogData.title}
            fill
          />
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8">
          <header className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {BlogData.title}
              </h2>

              <p className="text-gray-600 text-sm">{BlogData.description}</p>

              <div className="flex items-center gap-3 mt-2">
                <div className="w-7 h-7 relative">
                  <Image
                    src="/globe.svg"
                    fill
                    alt="author"
                    className="rounded"
                  />
                </div>

                <p className="text-sm text-gray-700">
                  {BlogData.user?.metaAddress ?? "Unknown user"}
                </p>
              </div>

              <p className="mt-1 text-xs text-gray-500">{formattedDate}</p>
            </div>

            {/* LIKE / DISLIKE / VIEWS */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👍 {BlogData.likes.length}
              </button>

              <button
                onClick={handleDislike}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👎 {BlogData.dislikes.length}
              </button>

              <div className="px-3 py-1 rounded-md bg-gray-50 text-sm text-gray-700 border border-gray-200">
                👁 {BlogData.views.length + BlogData.notLoggedViews}
              </div>
            </div>
          </header>

          {/* EXCERPT */}
          <p className="mt-4 text-gray-800 leading-relaxed">
            {BlogData.content.slice(0, 140)}...
            <Link
              href={`/blogs/${BlogData._id}`}
              className="text-gray-900 font-medium hover:underline ml-2"
            >
              Read more →
            </Link>
          </p>

          {/* CATEGORIES */}
          <div className="mt-6 flex gap-3 flex-wrap">
            {BlogData.categories?.map((c: string) => (
              <span
                key={c}
                className="text-xs bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
