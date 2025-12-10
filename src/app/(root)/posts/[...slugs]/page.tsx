import { Metadata } from "next";
import { User } from "@/constant/types";
import { last } from "lodash";
import {
  getPostBySlug,
  getPostPublicById,
} from "@/modules/services/postService";
import PostRender from "@/components/post-render";

const Page = async (props: {
  params: Promise<{ slugs: string[]; locale: string }>;
}) => {
  const params = await props.params;

  const res = await getPostPublicById(last(params.slugs) || "");

  return <PostRender pageData={res || undefined} />;
};

export async function generateMetadata(context: {
  params: Promise<{ slugs?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await context.params;
  const { slugs = [] } = resolvedParams;
  const post = await getPostPublicById(last(slugs) || "");

  return {
    title: `${post?.title}`,
    description: post?.content?.slice(0, 150),
    openGraph: {
      title: `${post?.title}`,
      description: post?.content?.slice(0, 150),
      images: [{ url: post?.featureImageUrl || "/default-image.jpg" }],
    },
  };
}

export default Page;
