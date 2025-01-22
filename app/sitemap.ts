import { type MetadataRoute } from "next";

import { getContentList } from "src/apis/notion";
import { METADATA } from "src/utils/constants";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const postList = await getContentList();

  const baseUrl = METADATA.meta.url;

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/post`, lastModified: new Date() },
  ];

  const postsEntries: MetadataRoute.Sitemap = postList.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.createDate),
  }));

  return [...routes, ...postsEntries];
};

export default sitemap;
