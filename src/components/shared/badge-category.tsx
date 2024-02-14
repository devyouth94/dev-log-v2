import { useRouter } from "next/router";

import { Badge } from "~/components/ui/badge";

import useBadgeFunction from "~/hooks/use-badge-function";
import { ITagItem } from "~/types/post";

type IProps = {
  pathname: "post" | "note";
  item: Partial<ITagItem>;
};

const BadgeCategory = ({ pathname, item }: IProps) => {
  const { query } = useRouter();
  const { category: categoryQuery } = query;

  const { onClickCategory } = useBadgeFunction(pathname);

  return (
    <Badge
      key={item.title}
      variant={categoryQuery === item.title ? "default" : "secondary"}
      className="shrink-0 gap-1"
      onClick={() => onClickCategory(item.title!)}
      hasDeleteButton={categoryQuery === item.title}
    >
      <span>{item.title}</span>
      {item.count && <span className="font-extralight">{item.count}</span>}
    </Badge>
  );
};

export default BadgeCategory;
