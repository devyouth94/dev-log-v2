import { DefaultSeoProps } from "next-seo";
import { METADATA } from "~/utils/constants";

const DEFAULT_SEO: DefaultSeoProps = {
  defaultTitle: METADATA.meta.title,
  titleTemplate: `%s | ${METADATA.meta.title}`,
  description: METADATA.meta.description,
  canonical: METADATA.meta.url,
  openGraph: {
    type: "website",
    url: METADATA.meta.url,
    title: METADATA.meta.title,
    description: METADATA.meta.description,
    images: [
      {
        url: `${METADATA.meta.url}/og-image.png`,
        width: 900,
        height: 900,
      },
    ],
    article: {
      authors: [METADATA.meta.authors],
    },
  },
};

export default DEFAULT_SEO;
