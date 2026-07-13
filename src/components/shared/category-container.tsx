"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Badge } from "src/components/ui/badge";
import type { Post } from "src/types/post";
import { getCategoryList } from "src/utils/data-format";
import { getPostPath } from "src/utils/routes";

type Props = {
  postList: Post[];
};

const CategoryContainer = ({ postList }: Props) => {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams?.get("category");

  const categoryList = getCategoryList(
    postList.map(({ category }) => category),
  );

  return (
    <div className="flex flex-wrap gap-1">
      {categoryList.map((item) => (
        <Link
          key={item.title}
          replace
          href={
            item.title === "all"
              ? getPostPath()
              : `${getPostPath()}?category=${item.title}`
          }
        >
          <Badge
            variant={
              categoryQuery === item.title ||
              (!categoryQuery && item.title === "all")
                ? "full"
                : "secondary"
            }
            className="shrink-0 gap-1"
          >
            <span>{item.title}</span>
            {item.count && (
              <span className="font-roboto font-light">{item.count}</span>
            )}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default CategoryContainer;
