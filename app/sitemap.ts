import { type MetadataRoute } from "next";

import {
  getPublishedPortfolioEntries,
  getPublishedPosts,
} from "src/apis/notion";
import {
  getPortfolioUrl,
  getPostUrl,
  getSiteUrl,
  SITE_ORIGINS,
} from "src/utils/routes";

export const revalidate = 30;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [postList, portfolioList] = await Promise.all([
    getPublishedPosts(),
    getPublishedPortfolioEntries(),
  ]);

  return [
    { url: getSiteUrl(), lastModified: new Date() },
    { url: getPostUrl(), lastModified: new Date() },
    { url: getPortfolioUrl(), lastModified: new Date() },
    { url: SITE_ORIGINS.resume, lastModified: new Date() },
    ...postList.map((post) => ({
      url: getPostUrl(post.slug),
      lastModified: new Date(post.createDate),
    })),
    ...portfolioList.map((entry) => ({
      url: getPortfolioUrl(entry.slug),
      lastModified: new Date(),
    })),
  ];
};

export default sitemap;
