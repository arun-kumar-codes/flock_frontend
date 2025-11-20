import { Metadata } from "next";
import ClientVideoPage from "./ClientVideoPage";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video/${id}`, {
      cache: "no-store",
    });

    const data = await res.json();
    const video = data?.video;

    const title = video?.title || "Video";
    const desc =
      video?.description?.slice(0, 150) || "Watch this video on FLOCK";

    const image =
      video?.thumbnail ||
      video?.thumbnail_url ||
      "/Logo.png";

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/viewer/video/${id}`,
        type: "video.other",
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
      title: "Video",
      description: "Watch this video on FLOCK",
    };
  }
}

export default async function VideoPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return <ClientVideoPage initialVideo={data} videoId={id} />;
}
