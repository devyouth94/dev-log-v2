import Image from "next/image";
import { useRouter } from "next/router";
import { ComponentPropsWithoutRef } from "react";
import Icon from "~/components/shared/icon";

import { Badge } from "~/components/ui/badge";

import useBadgeFunction from "~/hooks/use-badge-function";
import { IPostItem } from "~/types/post";
import { cn } from "~/utils/className";
import { getRenderedDate } from "~/utils/date";

type IProps<T> = {
  pathname: "post" | "note";
  item: T;
} & ComponentPropsWithoutRef<"article">;

const ArticleItem = <T extends IPostItem>({
  pathname,
  item,
  ...props
}: IProps<T>) => {
  const { push } = useRouter();
  const { onClickCategory, onClickTag } = useBadgeFunction(pathname);

  return (
    <article
      {...props}
      onClick={() => push(`/post/${item.slug}`)}
      className="grid cursor-pointer grid-rows-[200px_40px] saturate-0 transition-all hover:saturate-100"
    >
      <div className="relative flex flex-col justify-between overflow-hidden p-3">
        <Badge
          className="z-10"
          onClick={(e) => {
            e.stopPropagation();
            onClickCategory(item.category);
          }}
        >
          {item.category}
        </Badge>

        <div
          className={cn(
            "z-10 flex flex-col gap-1",
            item.thumbnail && "text-white",
          )}
        >
          <span className="text-lg font-semibold">{item.title}</span>
          {!!item.summary && (
            <span className="block truncate text-sm">{item.summary}</span>
          )}
        </div>

        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.thumbnail}
            sizes="800px"
            priority
            fill
            className="object-cover brightness-50"
          />
        )}
      </div>

      <div className="flex items-center justify-between text-sm font-light">
        <div className="flex items-center gap-1">
          {item.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onClickTag(tag);
              }}
            >
              {`#${tag}`}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex shrink-0 items-center gap-1">
            <Icon name="Calendar" />
            <span>{getRenderedDate(item.createDate)}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Icon name="Clock3" />
            <span>{item.readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleItem;
