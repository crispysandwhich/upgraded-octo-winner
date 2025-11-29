import SingleBlogDisp from "@/app/components/SingleBlogDisp";
import { getSession } from "@/app/lib/actions";
import { GetBlogById } from "@/app/lib/BlogFunc";
import { GetBlogComments } from "@/app/lib/CommentFunc";

export default async function Page({ params }: { params: any }) {
  const { id } = await params;
  const singleBlog = await GetBlogById(id);
  const blogComments = await GetBlogComments(id);
  const session = await getSession()

  return (
    <div>
      <SingleBlogDisp 
        blog={JSON.stringify(singleBlog)}
        session={JSON.stringify(session)}
        comments={JSON.stringify(blogComments)}
      />
    </div>
  );
}
