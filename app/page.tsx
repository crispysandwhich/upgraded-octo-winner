"use server"
import Link from "next/link";
import RecentBlog from "./components/RecentBlog";
import CommentSection from "./components/CommentSection";
import { GetRecentBlog } from "./lib/BlogFunc";
import { getSession } from "./lib/actions";
import { GetBlogComments } from "./lib/CommentFunc";

export default async function BlogLandingFull() {

  const recentBlog = await GetRecentBlog()
  const commentsBlog = await GetBlogComments(recentBlog.message[0]._id)
  const userSession = await getSession()

 

  return (
    <div className="min-h-screen bg-[#2C4C57] text-gray-900 antialiased font-sans">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* HERO */}
        <section className="mb-8">
          <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 p-6 flex items-center gap-6 shadow-lg">
            {/* crest SVG */}
            <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-white/40 rounded-lg shadow-inner">
              <CrestSVG />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
                Journal
              </h1>
              <p className="mt-2 text-sm text-gray-600 max-w-xl">
                A calm, focused space for short reads and practical tutorials
                about web development and decentralized systems.
              </p>

              <div className="mt-4 flex gap-3 items-center">
                <Link
                  href="/blogs"
                  className="text-sm px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200 text-gray-800 shadow-sm hover:shadow transition"
                >
                  View All Blogs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BLOG + META */}
        <RecentBlog 
          blog={JSON.stringify(recentBlog)}
          session={JSON.stringify(userSession)}
         />

        <CommentSection 
          session={JSON.stringify(userSession)} 
          commentsBlog={JSON.stringify(commentsBlog)}
          blogId={recentBlog.message[0]._id.toString()}
        />

        {/* small features row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            title="Read Blogs"
            text="Explore short reads on coding and crypto. No signup required to read."
          />
          <FeatureCard
            title="Comment below"
            text="Join the conversation — logged in users will have liking & disliking."
          />
          <FeatureCard
            title="Leave a rate"
            text="Let us know if you enjoyed the content: thumbs up or down."
          />
        </section>
      </main>
    </div>
  );
}

/* small components */

const FeatureCard = ({ title, text }: { title: string; text: string }) => (
  <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4">
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);

/* Simple crest SVG; tweak colors/sizes as desired */
const CrestSVG = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    {/* Shield */}
    <path
      d="M36 4 L62 16 V36 C62 56 46 68 36 70 C26 68 10 56 10 36 V16 L36 4Z"
      fill="#F3F4F6"
      stroke="#D4D4D8"
      strokeWidth="2"
    />

    {/* Crown */}
    <path
      d="M24 18 L28 12 L32 18 L36 12 L40 18 L44 12 L48 18"
      stroke="#CA8A04"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Trophy cup */}
    <path
      d="M28 24 H44 V34 C44 40 38 46 36 46 C34 46 28 40 28 34 V24Z"
      fill="#E5E7EB"
      stroke="#A8A29E"
      strokeWidth="2"
    />

    {/* Handles */}
    <path
      d="M28 26 C22 26 22 34 28 34"
      stroke="#A8A29E"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M44 26 C50 26 50 34 44 34"
      stroke="#A8A29E"
      strokeWidth="2"
      fill="none"
    />

    {/* Diamond in the middle */}
    <path
      d="M36 28 L40 34 L36 40 L32 34 Z"
      fill="#60A5FA"
      stroke="#2563EB"
      strokeWidth="2"
    />

    {/* Base stand */}
    <rect x="30" y="46" width="12" height="4" rx="2" fill="#E2E8F0" />

    {/* Gold Bars Bottom */}
    <rect x="20" y="54" width="32" height="3" rx="1.5" fill="#FACC15" />
    <rect x="24" y="59" width="24" height="3" rx="1.5" fill="#FDE047" />
  </svg>
);
