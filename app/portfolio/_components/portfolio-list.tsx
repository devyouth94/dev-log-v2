import Link from "next/link";

import {
  getPortfolioSections,
  getRenderedPortfolioPeriod,
} from "app/portfolio/_sections";
import HoverPreviewLink from "src/components/shared/hover-preview-link";
import { Badge } from "src/components/ui/badge";
import { type PortfolioEntry } from "src/types/portfolio";
import { cn } from "src/utils/class-name";
import { getPortfolioPath } from "src/utils/routes";

type Props = {
  featuredOnly: boolean;
  portfolioList: PortfolioEntry[];
};

const PortfolioList = ({ featuredOnly, portfolioList }: Props) => {
  const portfolioSections = getPortfolioSections(portfolioList, featuredOnly);
  const toggleHref = featuredOnly
    ? `${getPortfolioPath()}?featured=false`
    : getPortfolioPath();

  return (
    <>
      <Link
        href={toggleHref}
        aria-label={
          featuredOnly ? "전체 포트폴리오 보기" : "대표 포트폴리오만 보기"
        }
        className="font-roboto flex items-center justify-end gap-2 px-3 text-xs font-medium focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
      >
        <span>대표 포트폴리오만 보기</span>
        <span
          aria-hidden
          className={cn(
            "size-3 border border-gray-950 bg-white",
            featuredOnly && "bg-gray-950",
          )}
        />
      </Link>

      {portfolioSections.length === 0 ? (
        <p className="font-roboto border-b border-gray-950 px-3 py-5 text-sm text-gray-500">
          No portfolio entries.
        </p>
      ) : (
        <div className="space-y-8">
          {portfolioSections.map(({ items, title }) => (
            <div key={title}>
              <h2 className="mt-12 mb-4 px-3 text-2xl font-black">{title}</h2>
              <div className="grid grid-cols-1 gap-y-3">
                {items.map((item) => (
                  <HoverPreviewLink
                    key={item.id}
                    href={getPortfolioPath(item.slug)}
                    className="min-h-34 px-3 py-5"
                    sizes="960px"
                    thumbnail={item.thumbnail}
                  >
                    <div
                      className={cn(
                        item.thumbnail &&
                          "transition-colors duration-250 group-hover:text-white",
                      )}
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
                          {getRenderedPortfolioPeriod(item.period)}
                        </span>
                      </div>

                      {item.stacks.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {item.stacks.map((stack) => (
                            <Badge
                              key={stack}
                              className="duration-250 group-hover:bg-gray-950 group-hover:text-white"
                            >
                              {stack}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </HoverPreviewLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PortfolioList;
