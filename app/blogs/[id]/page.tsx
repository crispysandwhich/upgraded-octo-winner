import SingleBlogDisp from "@/app/components/SingleBlogDisp";
import { GetBlogById } from "@/app/lib/BlogFunc";

export default async function Page({ params }: { params: any }) {
  const { id } = await params;
  const singleBlog = await GetBlogById(id);

  return (
    <div>
      <SingleBlogDisp blog={JSON.stringify(singleBlog)} />
    </div>
  );
}
