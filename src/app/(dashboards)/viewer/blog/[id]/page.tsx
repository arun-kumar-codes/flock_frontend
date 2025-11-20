import { Metadata } from "next";
import ClientBlogPage from "./ClientBlogPage";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {

  const { id } = await props.params;  // FIX

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`, {
      cache: "no-store",
    });

    const data = await res.json();
    const blog = data?.blog;

    const title = blog?.title || "Blog";
    const desc =
      blog?.excerpt ||
      (blog?.content ? blog.content.slice(0, 150) : "Read this blog on FLOCK");
    const image = blog?.image || blog?.thumbnail_url || "/Logo.png";

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/viewer/blog/${id}`,
        type: "article",
        images: [{ url: image, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Blog",
      description: "Read this blog on FLOCK",
    };
  }
}

export default async function BlogPage(
  props: { params: Promise<{ id: string }> }
) {

  const { id } = await props.params;  // FIX

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return <ClientBlogPage initialBlog={data} blogId={id} />;
}
