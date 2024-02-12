import { useRouter } from "next/router";
import { useMemo } from "react";

import { IPostItem } from "~/types/post";

const useFilteredList = <T extends IPostItem[]>(list: T, search: string) => {
  const { query, isReady } = useRouter();
  const { category, tag } = query;

  const filteredList = useMemo(() => {
    if (!isReady) return list;

    return list.filter(
      (item) =>
        (!category || category === item.category) &&
        (!tag ||
          item.tags.some((tagItem) =>
            String(tag).split(",").includes(tagItem),
          )) &&
        (search.length <= 1 ||
          [item.title, item.summary, item.contents].join("").includes(search)),
    );
  }, [isReady, list, category, tag, search]);

  return { filteredList };
};

export default useFilteredList;
