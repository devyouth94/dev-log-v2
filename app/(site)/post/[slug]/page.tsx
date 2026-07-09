import { type Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getPostDetail,
  getPublishedPostBySlug,
  getPublishedPosts,
} from "src/apis/notion";
import Comment from "src/components/shared/giscus";
import NotionRenderer from "src/components/shared/notion-renderer";
import PostTitle from "src/components/shared/post-title";
import { METADATA } from "src/utils/constants";
import { getPostUrl, OG_IMAGE_URL } from "src/utils/routes";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 30;

export const generateStaticParams = async () => {
  const postList = await getPublishedPosts();
  return postList.map((post) => ({ slug: post.slug }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const postItem = await getPublishedPostBySlug(slug);

  if (!postItem) return {};

  return {
    title: postItem.title,
    description: postItem.summary,
    openGraph: {
      type: "article",
      url: getPostUrl(postItem.slug),
      title: `${postItem.title} | ${METADATA.meta.title}`,
      images: [
        postItem.thumbnail
          ? { url: postItem.thumbnail }
          : {
              url: OG_IMAGE_URL,
              width: 1200,
              height: 630,
            },
      ],
    },
  };
};

const PostItemPage = async ({ params }: Props) => {
  const { slug } = await params;
  const postDetail = await getPostDetail(slug);

  if (!postDetail) return notFound();

  const { postItem, recordMap } = postDetail;

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full divide-y divide-gray-200 p-4 pt-24">
        <PostTitle postItem={postItem} />
        <NotionRenderer recordMap={recordMap} rootPageId={postItem.id} />
        <Comment />
      </section>
    </main>
  );
};

export default PostItemPage;
