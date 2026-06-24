import { type Metadata } from "next";

import { getPortfolioPage } from "src/apis/notion";
import UnderConstruction from "src/components/shared/under-construction";
import { Badge } from "src/components/ui/badge";
import { METADATA } from "src/utils/constants";
import { getRenderedDate } from "src/utils/date";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "portfolio",
  openGraph: {
    url: `${METADATA.meta.url}/portfolio`,
    title: `portfolio | ${METADATA.meta.title}`,
  },
};

const PortfolioPage = async () => {
  const { portfolioList, status } = await getPortfolioPage();

  if (status !== "Published") return <UnderConstruction />;

  const getRenderedPeriod = (period: number | number[] | null) => {
    if (!period) return "";
    if (Array.isArray(period)) {
      return period.map(getRenderedDate).join(" - ");
    }

    return getRenderedDate(period);
  };

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full p-4">
        {portfolioList.length === 0 ? (
          <p className="font-roboto border-b border-gray-950 px-3 py-5 text-sm text-gray-500">
            No portfolio entries.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
            {portfolioList.map((item) => (
              <article
                key={item.id}
                className="min-h-34 border-b border-gray-950 px-3 py-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p>
                    <span className="line-clamp-1 text-xl font-bold">
                      {item.title}
                    </span>
                    {!!item.summary && (
                      <span className="mt-1 line-clamp-2 text-sm">
                        {item.summary}
                      </span>
                    )}
                  </p>
                  <span className="font-roboto shrink-0 text-xs font-normal">
                    {getRenderedPeriod(item.period)}
                  </span>
                </div>

                {item.stacks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.stacks.map((stack) => (
                      <Badge key={stack} variant="secondary">
                        {stack}
                      </Badge>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default PortfolioPage;
