"use server";

import AllBlogsDisp from "../components/AllBlogsDisp";
import { GetAllBlogs } from "../lib/BlogFunc";

const page = async () => {
  const allBlogs = await GetAllBlogs();

  return (
    <div>
      <h2 className="text-2xl">All blogs</h2>

      <AllBlogsDisp
        blogs={
          allBlogs.status === "success" ? JSON.stringify(allBlogs.message) : []
        }
      />
    </div>
  );
};

export default page;
