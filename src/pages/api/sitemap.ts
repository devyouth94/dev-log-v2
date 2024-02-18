import { format } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";

import { getContentList } from "~/apis/notion";
import { METADATA } from "~/utils/constants";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const [post, note] = await Promise.all([
    getContentList("post"),
    getContentList("note"),
  ]);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${METADATA.meta.url}/post</loc>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
  ${post?.map(
    (item) => `<url>
    <loc>${METADATA.meta.url}/post/${item.slug}</loc>
    <lastmod>${format(new Date(item.createDate), "yyyy-MM-dd")}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>`,
  )}
  <url>
  <loc>${METADATA.meta.url}/note</loc>
  <changefreq>daily</changefreq>
  <priority>0.5</priority>
  </url>
  ${note?.map(
    (item) => `<url>
    <loc>${METADATA.meta.url}/note/${item.slug}</loc>
    <lastmod>${format(new Date(item.createDate), "yyyy-MM-dd")}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>`,
  )}
  <url>
    <loc>${METADATA.meta.url}/resume</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  </urlset>`;

  console.log(xml);

  res.end(xml);
};

export default handler;
