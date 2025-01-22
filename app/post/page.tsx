import { type Metadata } from "next";

import { getContentList } from "src/apis/notion";
import CategoryContainer from "src/components/shared/category-container";
import PostContainer from "src/components/shared/post-container";
import { METADATA } from "src/utils/constants";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "post",
  openGraph: {
    url: `${METADATA.meta.url}/post`,
    title: `post | ${METADATA.meta.title}`,
  },
};

const PostPage = async () => {
  const postList = await getContentList();

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="mx-auto w-full min-w-limit max-w-content space-y-5 p-4 pt-[90px]">
        <CategoryContainer postList={postList} />
        <PostContainer postList={postList} />
      </section>
    </main>
  );
};

export default PostPage;
