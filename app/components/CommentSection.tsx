"use client";
import { useEffect, useRef, useState } from "react";

type Comment = { id: string; name: string; date: string; text: string };

const BATCH = 10;
const INITIAL_VISIBLE = BATCH;

const CommentSection = () => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(
    Array.from({ length: 27 }).map((_, i) => ({
      id: String(i + 1),
      name: `Reader ${i + 1}`,
      date: new Date(Date.now() - i * 1000 * 60 * 60).toLocaleString(),
      text: "Thoughtful reaction — short, professional, useful. This is a sample comment to show layout.",
    }))
  );

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef<number>(0);

  const submitComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    const c: Comment = {
      id: String(Date.now()),
      name: "Anonymous",
      date: new Date().toLocaleString(),
      text,
    };
    setComments((s) => [c, ...s]);
    setCommentText("");
    // ensure newly posted comment is visible
    setVisibleCount((v) =>
      Math.min(comments.length + 1, Math.max(INITIAL_VISIBLE, v))
    );
    // scroll to top of comment container if desired (optional)
    commentsRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // scroll handler: scroll down to increase visibleCount by BATCH,
  // scroll up (any upward movement) resets visibleCount to initial
  useEffect(() => {
    const el = commentsRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      // Scroll down near bottom -> load more
      if (scrollTop + clientHeight >= scrollHeight - 16) {
        setVisibleCount((v) => Math.min(comments.length, v + BATCH));
      }

      // Scroll up -> collapse to initial when user scrolls upwards
      if (scrollTop < lastScrollTop.current) {
        // upward scroll detected
        setVisibleCount(INITIAL_VISIBLE);
      }

      lastScrollTop.current = scrollTop;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [comments.length]);

  return (
    <section className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-lg p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comments</h3>
        <span className="text-sm text-gray-500">{comments.length} total</span>
      </div>

      {/* input */}
      <form onSubmit={submitComment} className="mt-4 space-y-3">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          placeholder="Share a respectful thought..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
        />
        <div className="flex justify-end items-center">

          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm shadow-sm hover:bg-black"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* comments container */}
      <div
        ref={commentsRef}
        className="mt-4 max-h-96 overflow-auto border-t border-gray-100 pt-4 space-y-4"
      >
        {comments.slice(0, visibleCount).map((c) => (
          <div
            key={c.id}
            className="px-3 py-3 rounded-md bg-gray-50 border border-gray-100"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {c.name}
                </div>
                <div className="text-xs text-gray-500">{c.date}</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{c.text}</p>
          </div>
        ))}
      </div>

      {/* controls (also reflect dynamic state) */}
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
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Load more
            </button>
          )}

          {visibleCount > INITIAL_VISIBLE && (
            <button
              onClick={() => setVisibleCount(INITIAL_VISIBLE)}
              className="px-3 py-1 rounded-md bg-white border border-gray-200 text-sm"
            >
              Collapse
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
