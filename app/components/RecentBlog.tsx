"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const RecentBlog = () => {
  const [likes, setLikes] = useState(5);
  const [dislikes, setDislikes] = useState(2);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [views, setViews] = useState<number>(1024);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes((l) => Math.max(0, l - 1));
      return;
    }
    if (disliked) {
      setDisliked(false);
      setDislikes((d) => Math.max(0, d - 1));
    }
    setLiked(true);
    setLikes((l) => l + 1);
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikes((d) => Math.max(0, d - 1));
      return;
    }
    if (liked) {
      setLiked(false);
      setLikes((l) => Math.max(0, l - 1));
    }
    setDisliked(true);
    setDislikes((d) => d + 1);
  };


  useEffect(() => {
    setViews((v) => v + 1); // increment view on client mount
  }, []);
  
  return (
    <section className="mb-8">
      <article className="rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden">
        <div className="relative w-full h-[300px] sm:h-[420px] md:h-[520px]">
          <Image
            src="/blogthumb.png"
            alt="blog thumbnail"
            fill
            sizes="(max-width:768px) 100vw, 100vw"
          />
        </div>

        <div className="p-6">
          <header className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                My First Blog
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 relative ">
                  <Image src="/globe.svg" alt="logo" fill className="rounded" />
                </div>
                <h3>LyubTHEBEST1</h3>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Published October 5, 2023
              </p>
            </div>

            {/* like/dislike/views */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                aria-label="like"
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  liked
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                👍 {likes}
              </button>
              <button
                onClick={handleDislike}
                aria-label="dislike"
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  disliked
                    ? "bg-rose-700 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                👎 {dislikes}
              </button>
              <div className="px-3 py-1 rounded-md bg-gray-50 text-sm text-gray-700 border border-gray-100">
                👁 {views}
              </div>
            </div>
          </header>

          <p className="mt-4 text-gray-700 leading-relaxed">
            This is a composed excerpt — a short, crisp summary of the post. It
            introduces the subject and gives the reader enough context to decide
            whether to read further.{" "}
            <Link
              href="/blogs/1"
              className="text-gray-900 font-medium hover:underline"
            >
              Read more →
            </Link>
          </p>

          <div className="mt-6 flex gap-3 flex-wrap">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
              coding
            </span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
              web3
            </span>
          </div>
        </div>
      </article>
    </section>
  );
};

export default RecentBlog;
