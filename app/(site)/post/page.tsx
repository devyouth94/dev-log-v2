import { type Metadata } from "next";

import { getPublishedPosts } from "src/apis/notion";
import CategoryContainer from "src/components/shared/category-container";
import PostContainer from "src/components/shared/post-container";
import { METADATA } from "src/utils/constants";
import { getPostUrl } from "src/utils/routes";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "post",
  openGraph: {
    url: getPostUrl(),
    title: `post | ${METADATA.meta.title}`,
  },
};

const PostPage = async () => {
  const postList = await getPublishedPosts();

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full space-y-3 p-4 pt-22.5">
        <CategoryContainer postList={postList} />
        <PostContainer postList={postList} />
      </section>
    </main>
  );
};

export default PostPage;
