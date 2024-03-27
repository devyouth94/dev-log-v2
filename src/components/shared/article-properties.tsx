import Icon from "~/components/shared/icon";
import { Badge } from "~/components/ui/badge";

import { IPostItem } from "~/types/post";
import { getRenderedDate } from "~/utils/date";

type IProps = {
  postItem: IPostItem;
};

const ArticleProperties = ({ postItem }: IProps) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-center text-3xl font-extrabold">
          {postItem.title}
        </span>
        <span className="text-center text-gray-500">{postItem.summary}</span>
      </div>

      <div className="flex gap-1">
        <Badge className="cursor-default">{postItem.category}</Badge>
        {postItem.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-default"
          >{`#${tag}`}</Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm font-extralight">
        <div className="flex items-center gap-1">
          <Icon name="Calendar" />
          <span>{getRenderedDate(postItem.createDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Clock3" />
          <span>{postItem.readTime}</span>
        </div>
      </div>
    </>
  );
};

export default ArticleProperties;
