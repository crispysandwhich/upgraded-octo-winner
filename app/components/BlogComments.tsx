"use client";

import { UploadComment } from "../lib/CommentFunc";

interface BlogCommentsProps {
  userSession: any;
  blogId: string;
  comments: any;
  path: any;
}

const BlogComments = ({ userSession, blogId, comments, path }: BlogCommentsProps) => {
  const commentData = JSON.parse(comments).message;

  const HandleBlogComment = async (e:any) => {
    e.preventDefault();
    const commentText = e.target.userComment.value.trim();

    const res = await UploadComment({
      content: commentText,
      blogId,
      userId: userSession.userId,
      path
    });

  };

  return (
    <div
      className="mt-6 w-full max-w-2xl mx-auto p-5 rounded-2xl 
      bg-gradient-to-b from-[#fafaf7] to-[#f0efe9] 
      dark:from-[#1a1a1a] dark:to-[#111] 
      border border-[#e5e3dc] dark:border-[#2a2a2a] 
      shadow-[0_0_25px_-10px_rgba(0,0,0,0.25)] 
      transition-colors duration-300"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Leave a Comment
      </h3>

      {userSession?.isLoggedIn ? (
        <form onSubmit={HandleBlogComment} className="flex flex-col gap-4">
          <textarea
            name="userComment"
            id="userComment"
            placeholder="Share your thoughts…"
            className="w-full rounded-xl min-h-[110px] p-4 
              bg-[#ffffff]/70 dark:bg-[#1f1f1f]/70 
              border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-200
              backdrop-blur-sm
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-500
              transition-all"
          ></textarea>

          <button
            type="submit"
            className="w-fit px-5 py-2.5
              rounded-xl font-medium
              bg-gradient-to-r from-orange-400 to-amber-500 
              hover:from-orange-500 hover:to-amber-600
              dark:from-orange-500 dark:to-amber-600
              dark:hover:from-orange-600 dark:hover:to-amber-700
              text-white shadow-md hover:shadow-lg
              transition-all active:scale-[0.97]"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <div
          className="p-4 rounded-xl 
          bg-white/70 dark:bg-[#1a1a1a]/60 
          border border-gray-300 dark:border-gray-700
          text-gray-700 dark:text-gray-300
          backdrop-blur-sm text-center"
        >
          You must log in to leave a comment.
        </div>
      )}

<div className="mt-8 flex flex-col gap-4">
  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
    Comments ({commentData.length})
  </h4>

  {commentData.length === 0 && (
    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
      No comments yet. Be the first to share your thoughts.
    </div>
  )}

  {commentData.map((c:any) => {
    const shortMeta =
      c.user?.metaAddress
        ? `${c.user.metaAddress.slice(0, 6)}...${c.user.metaAddress.slice(-4)}`
        : "Unknown User";

    return (
      <div
        key={c._id}
        className="
          p-5 rounded-xl border 
          border-[#e6e4dd] dark:border-[#2a2a2a]
          bg-white/60 dark:bg-[#1a1a1a]/60 
          shadow-sm backdrop-blur-sm
          transition-all
        "
      >
        {/* User Info */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {shortMeta}
          </span>

          <span className="text-xs text-gray-500 dark:text-gray-500">
            {new Date(c.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Comment Text */}
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
          {c.text}
        </p>

        {/* Likes / Dislikes */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            👍 {c.likes?.length || 0}
          </span>

          <span className="text-gray-600 dark:text-gray-400">
            👎 {c.dislikes?.length || 0}
          </span>
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
};

export default BlogComments;
