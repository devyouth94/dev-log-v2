import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { getContentList } from "src/apis/notion";
import Comment from "src/components/shared/giscus";
import NotionRenderer from "src/components/shared/notion-renderer";
import PostTitle from "src/components/shared/post-title";
import { METADATA } from "src/utils/constants";
import { notion } from "src/utils/notion";

type Props = {
  params: {
    slug: string;
  };
};

export const generateStaticParams = async () => {
  const postList = await getContentList();
  return postList.map((post) => ({ slug: post.slug }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const postList = await getContentList();
  const postItem = postList.find((item) => item.slug === params.slug);

  if (!postItem) return {};

  return {
    title: postItem.title,
    description: postItem.summary,
    openGraph: {
      type: "article",
      url: `${METADATA.meta.url}/post/${postItem.slug}`,
      title: `${postItem.title} | ${METADATA.meta.title}`,
      images: [
        {
          url: postItem.thumbnail || `${METADATA.meta.url}/og-image.png`,
          width: 900,
        },
      ],
    },
  };
};

const PostItemPage = async ({ params }: Props) => {
  const postList = await getContentList();
  const postItem = postList.find((item) => item.slug === params.slug);

  if (!postItem) return notFound();

  const recordMap = await notion.getPage(postItem.id);

  return (
    <>
      <main className="min-h-dvh w-full bg-white">
        <section className="mx-auto w-full min-w-limit max-w-content space-y-5 divide-y divide-gray-950 p-4 pt-[120px]">
          <PostTitle postItem={postItem} />
          <NotionRenderer recordMap={recordMap} />
          <Comment />
        </section>
      </main>
    </>
  );
};

export default PostItemPage;
