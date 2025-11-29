"use client";
import { useEffect, useRef, useState } from "react";
import { UploadComment } from "../lib/CommentFunc";
import { usePathname } from "next/navigation";

interface CommentSectionProps {
  session: any;
  commentsBlog: any;
  blogId: string;
}

const BATCH = 10;
const INITIAL_VISIBLE = BATCH;

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;

const CommentSection = ({
  session,
  commentsBlog,
  blogId,
}: CommentSectionProps) => {
  const UserSession = JSON.parse(session);
  const UserComments = JSON.parse(commentsBlog).message;

  console.log("UserComments list availbe in the comment section for the recent:", UserComments);

  const pathname = usePathname();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(UserComments || []);

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef<number>(0);

  // SUBMIT COMMENT
  const submitComment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    // send to DB
    const result = await UploadComment({
      content: text,
      blogId,
      userId: UserSession.userId,
      path: pathname,
    });

    console.log(result, "Upload Comment Result");
  };

  return (
    <section
      className="
        mb-8 rounded-2xl 
        bg-gradient-to-b from-[#f5f4ef] to-[#edebe4]
        dark:from-[#1a1a1a] dark:to-[#101010]
        border border-[#e0ddd5] dark:border-[#2a2a2a]
        shadow-[0_0_35px_-10px_rgba(0,0,0,0.25)]
        p-6 text-gray-700 dark:text-gray-300
      "
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comments
        </h3>
        <span className="text-sm text-gray-500">{comments.length} total</span>
      </div>

      {/* COMMENT BOX */}
      {UserSession.isLoggedIn && (
        <form onSubmit={submitComment} className="mt-4 space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts..."
            className="
              w-full rounded-xl min-h-[100px] p-4 resize-none
              bg-white/80 dark:bg-[#1f1f1f]/70
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-600
            "
          />

          <div className="flex justify-end items-center">
            <button
              type="submit"
              className="
                px-4 py-2 rounded-xl text-white text-sm font-medium
                bg-gradient-to-r from-orange-400 to-amber-500
                hover:from-orange-500 hover:to-amber-600
                dark:from-orange-500 dark:to-amber-600
                shadow-md hover:shadow-lg transition-all
                active:scale-[0.97]
              "
            >
              Post Comment
            </button>
          </div>
        </form>
      )}

      {/* COMMENT LIST */}
      <div
        ref={commentsRef}
        className="mt-5 max-h-96 overflow-auto border-t border-[#e2dfd6] dark:border-[#333] pt-4 space-y-4 pr-2"
      >
        {comments.slice(0, visibleCount).map((c: any) => (
          <div
            key={c._id}
            className="
              px-4 py-4 rounded-xl
              bg-white/70 dark:bg-[#1c1c1c]
              border border-[#e6e4dc] dark:border-[#2c2c2c]
              shadow-sm animate-fadeIn
            "
          >
            {/* TOP USER ROW */}
            <div className="flex items-center gap-3">
              <img
                src={avatar(c.user?.metaAddress)}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
                alt=""
              />

              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {c.user?.metaAddress?.slice(0, 10)}...
                </div>

                <div className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* COMMENT TEXT */}
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {c.text}
            </p>

            {/* LIKE / DISLIKE */}
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>👍 {c.likes.length}</span>
              <span>👎 {c.dislikes.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER CONTROLS */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Showing {Math.min(visibleCount, comments.length)} of {comments.length}
        </div>

        <div className="flex gap-2">
          {visibleCount < comments.length && (
            <button
              onClick={() =>
                setVisibleCount((v) => Math.min(comments.length, v + BATCH))
              }
              className="px-3 py-1 rounded-md bg-gray-200 dark:bg-[#333] hover:bg-gray-300 dark:hover:bg-[#444] text-sm transition"
            >
              Load more
            </button>
          )}

          {visibleCount > INITIAL_VISIBLE && (
            <button
              onClick={() => setVisibleCount(INITIAL_VISIBLE)}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-[#222] border border-gray-300 dark:border-gray-700 hover:border-gray-500 text-sm transition"
            >
              Collapse
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </section>
  );
};

export default CommentSection;
