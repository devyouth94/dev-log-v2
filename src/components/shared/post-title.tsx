import Icon from "src/components/shared/icon";
import { Badge } from "src/components/ui/badge";
import { type IPostDetailItem } from "src/types/post";
import { getRenderedDate } from "src/utils/date";

type Props = {
  postItem: IPostDetailItem;
};

const PostTitle = ({ postItem }: Props) => {
  return (
    <section className="flex flex-col items-center gap-4 pb-5">
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="text-center text-3xl font-extrabold">
          {postItem.title}
        </span>
        <span className="text-center">{postItem.summary}</span>
      </div>

      <Badge variant="full">{postItem.category}</Badge>

      <div className="font-roboto flex flex-col items-center gap-1 text-xs">
        <div className="flex items-center gap-1">
          <Icon name="Calendar" strokeWidth={1.2} />
          <span>{getRenderedDate(postItem.createDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Clock3" strokeWidth={1.2} />
          <span>{postItem.readTime}</span>
        </div>
      </div>
    </section>
  );
};

export default PostTitle;
