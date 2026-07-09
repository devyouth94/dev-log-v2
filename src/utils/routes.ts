import { METADATA } from "src/utils/constants";

const PORTFOLIO_HOST = "portfolio.youngzin-log.com";
const RESUME_HOST = "resume.youngzin-log.com";

export const SITE_PATHS = {
  home: "/",
  portfolio: "/portfolio",
  post: "/post",
  resume: "/resume",
} as const;

export const SITE_ORIGINS = {
  home: METADATA.meta.url,
  portfolio: `https://${PORTFOLIO_HOST}`,
  resume: `https://${RESUME_HOST}`,
} as const;

export const SUBDOMAIN_PATH_PREFIX: Record<string, string> = {
  [PORTFOLIO_HOST]: SITE_PATHS.portfolio,
  [RESUME_HOST]: SITE_PATHS.resume,
};

export const getSiteUrl = (path: string = SITE_PATHS.home) =>
  `${SITE_ORIGINS.home}${path === SITE_PATHS.home ? "" : path}`;

export const getPostPath = (slug?: string) =>
  slug ? `${SITE_PATHS.post}/${slug}` : SITE_PATHS.post;

export const getPostUrl = (slug?: string) => getSiteUrl(getPostPath(slug));

export const getPortfolioPath = (slug?: string) =>
  slug ? `${SITE_PATHS.portfolio}/${slug}` : SITE_PATHS.portfolio;

export const getPortfolioUrl = (slug?: string) =>
  `${SITE_ORIGINS.portfolio}${slug ? `/${slug}` : ""}`;

export const OG_IMAGE_URL = getSiteUrl("/og-image.png");
