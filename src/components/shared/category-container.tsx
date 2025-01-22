"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Badge } from "src/components/ui/badge";
import type { IPostItem } from "src/types/post";
import { getCategoryList } from "src/utils/data-format";

type Props = {
  postList: IPostItem[];
};

const CategoryContainer = ({ postList }: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams?.get("category");

  const categoryList = getCategoryList(
    postList.map(({ category }) => category),
  );

  const handleClickCategory = (category: string) => {
    switch (category) {
      case "all":
        replace("/post");
        break;
      default:
        replace(`/post?category=${category}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {categoryList.map((item) => (
        <Badge
          key={item.title}
          variant={
            categoryQuery === item.title ||
            (!categoryQuery && item.title === "all")
              ? "full"
              : "secondary"
          }
          className="shrink-0 gap-1"
          onClick={() => handleClickCategory(item.title)}
        >
          <span>{item.title}</span>
          {item.count && (
            <span className="font-roboto font-light">{item.count}</span>
          )}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryContainer;
