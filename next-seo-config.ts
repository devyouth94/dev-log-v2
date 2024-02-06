import { DefaultSeoProps } from "next-seo";
import { METADATA } from "~/utils/constants";

const DEFAULT_SEO: DefaultSeoProps = {
  defaultTitle: METADATA.meta.title,
  titleTemplate: `%s | ${METADATA.meta.title}`,
  description: METADATA.meta.description,
  canonical: METADATA.meta.url,
  openGraph: {
    article: {
      authors: [METADATA.meta.authors],
    },
  },
};

export default DEFAULT_SEO;
