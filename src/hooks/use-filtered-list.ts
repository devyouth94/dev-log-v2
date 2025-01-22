import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { type IPostItem } from "src/types/post";

const useFilteredList = <T extends IPostItem[]>(list: T, search: string) => {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category");

  const filteredList = useMemo(() => {
    return list.filter(
      (item) =>
        (!category || category === item.category) &&
        (search.length <= 1 ||
          [item.title, item.summary, item.contents].join("").includes(search)),
    );
  }, [list, category, search]);

  return { filteredList };
};

export default useFilteredList;
