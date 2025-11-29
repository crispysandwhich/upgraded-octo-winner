"use client";

import Image from "next/image";
import Link from "next/link";

interface AllBlogsDispProps {
  blogs: any;
}

const AllBlogsDisp = ({ blogs }: AllBlogsDispProps) => {
  const blogData = JSON.parse(blogs);

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      {blogData.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No blogs available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogData.map((blog: any) => (
            <Link
              href={`/blogs/${blog._id}`}
              key={blog._id}
              className="bg-[#14161a] border border-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-[180px] overflow-hidden bg-black">
                {blog.image ? (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {blog.title}
                </h3>

                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                  {blog.description}
                </p>

                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span className="text-[12px] font-bold">✍️ Author: {blog.user.metaAddress || "Unknown"}</span>
                  <span>
                    📅{" "}
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogsDisp;
