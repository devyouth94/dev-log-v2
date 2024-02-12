import { useRouter } from "next/router";
import qs from "qs";

const useBadgeFunction = (pathname: "post" | "note") => {
  const { query, replace } = useRouter();
  const { category: categoryQuery, tag: tagQuery } = query;

  const onClickCategory = (category: string) => {
    const newQuery = categoryQuery === category ? {} : { ...query, category };

    replace({
      pathname: `/${pathname}`,
      query: tagQuery ? { ...newQuery, tag: tagQuery } : newQuery,
    });
  };

  const onClickTag = (tag: string) => {
    const parseQuery = tagQuery ? String(tagQuery).split(",") : [];
    const newQuery = tagQuery?.includes(tag)
      ? parseQuery.filter((item) => item !== tag)
      : [...parseQuery, tag];

    replace({
      pathname: `/${pathname}`,
      query: qs.stringify(
        categoryQuery
          ? { category: categoryQuery, tag: newQuery }
          : { tag: newQuery },
        { arrayFormat: "comma" },
      ),
    });
  };

  return { onClickCategory, onClickTag };
};

export default useBadgeFunction;
