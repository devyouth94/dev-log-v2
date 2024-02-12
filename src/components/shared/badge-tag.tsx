import { useRouter } from "next/router";

import { Badge } from "~/components/ui/badge";

import useBadgeFunction from "~/hooks/use-badge-function";
import { ITagItem } from "~/types/post";

type IProps = {
  pathname: "post" | "note";
  item: ITagItem;
};

const BadgeTag = ({ pathname, item }: IProps) => {
  const { query } = useRouter();
  const { tag: tagQuery } = query;

  const { onClickTag } = useBadgeFunction(pathname);

  return (
    <Badge
      key={item.title}
      variant={tagQuery?.includes(item.title) ? "default" : "outline"}
      className="shrink-0 gap-1"
      onClick={() => onClickTag(item.title)}
      hasDeleteButton={tagQuery?.includes(item.title)}
    >
      <span>{`#${item.title}`}</span>
    </Badge>
  );
};

export default BadgeTag;
