"use client";
import Link from "next/link";
import { useModal } from "../hooks/use-modal-store";

const MainHeader = () => {
  const { onOpen } = useModal();

  const HandleAuthentication = () => {
    console.log("opening AuthModal");
    onOpen("AuthUser");
  };

  const isLoggedIn = true;

  return (
    <header className="w-full mx-auto max-w-5xl px-4 sm:px-6 py-3 rounded-xl bg-white/6 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg sm:text-2xl font-semibold tracking-tight ">
          <Link href="/" className="inline-block -ml-1">
            blog
          </Link>
        </h1>

        <nav className="flex items-center gap-3">
          <Link
            href="/blogs"
            className="text-sm sm:text-base  px-3 py-2 rounded-md transition"
          >
            Blogs
          </Link>

          <button
            onClick={HandleAuthentication}
            aria-label="Authenticate"
            className="inline-flex items-center text-sm sm:text-base px-3 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Authenticate
          </button>
        </nav>
      </div>
      {isLoggedIn && (
        <div className="flex items-center justify-between gap-4 text-sm mt-4">
          <h2 className="font-semibold tracking-tight ">
            hello admin
          </h2>
          <nav>
            <Link href="/blogs/create">Create Blog</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
