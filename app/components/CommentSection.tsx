"use client";
import { useState } from "react";
import { UploadComment } from "../lib/CommentFunc";
import { usePathname } from "next/navigation";

interface CommentSectionProps {
  session: any;
  commentsBlog: any;
  blogId: string;
} 

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;

const CommentSection = ({
  session,
  commentsBlog,
  blogId,
}: CommentSectionProps) => {
  const UserSession = JSON.parse(session);
  const UserComments = JSON.parse(commentsBlog).message;

  const pathname = usePathname();
  const [commentText, setCommentText] = useState("");

  const submitComment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    const result = await UploadComment({
      content: text,
      blogId,
      userId: UserSession.userId,
      path: pathname,
    });

    setCommentText("");
  };

  return (
    <section
      className="
      mb-10 p-6 rounded-2xl 
      bg-gradient-to-b from-[#f6f5f0] to-[#eceae3]
      dark:from-[#141414] dark:to-[#0f0f0f]
      border border-[#dbd7ce] dark:border-[#2c2c2c]
      shadow-[0_0_30px_-10px_rgba(0,0,0,0.25)]
    "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
          💬 Comments
        </h3>

        <span
          className="text-sm px-3 py-1 rounded-full 
        bg-gray-200 dark:bg-[#1e1e1e] 
        text-gray-700 dark:text-gray-400 
        border border-gray-300 dark:border-gray-700"
        >
          {UserComments.length} total
        </span>
      </div>

      {/* COMMENT INPUT */}
      {UserSession.isLoggedIn && (
        <form onSubmit={submitComment} className="mt-5 space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts..."
            className="
              w-full rounded-xl min-h-[100px] p-4 resize-none
              bg-white/90 dark:bg-[#1d1d1d]/70
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-200
              placeholder:text-gray-500 dark:placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500
              shadow-sm
            "
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="
                px-5 py-2.5 rounded-xl text-white text-sm font-medium
                bg-gradient-to-r from-orange-400 to-amber-500
                hover:from-orange-500 hover:to-amber-600
                shadow-md hover:shadow-lg transition-all
                active:scale-[0.97]
              "
            >
              Post Comment
            </button>
          </div>
        </form>
      )}

      {/* COMMENTS LIST */}
      <div className="mt-6 space-y-4 border-t border-[#dcd9d1] dark:border-[#2d2d2d] pt-4">
        {UserComments.map((c: any) => (
          <div
            key={c._id}
            className="
              px-4 py-4 rounded-xl
              bg-white/80 dark:bg-[#1a1a1a]
              border border-[#dedcd5] dark:border-[#2a2a2a]
              shadow-sm hover:shadow-md transition-shadow
            "
          >
            {/* TOP ROW */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatar(c.user?.metaAddress)}
                  className="w-11 h-11 rounded-full"
                  alt="avatar"
                />
                <div className="absolute inset-0 rounded-full ring-1 ring-gray-300 dark:ring-gray-700"></div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {c.user?.metaAddress
                    ? c.user.metaAddress.slice(0, 10) + "..."
                    : "Unknown User"}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* COMMENT */}
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {c.text}
            </p>

            {/* LIKES */}
            <div className="flex gap-5 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition">
                👍 {c.likes?.length ?? 0}
              </span>
              <span className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition">
                👎 {c.dislikes?.length ?? 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
