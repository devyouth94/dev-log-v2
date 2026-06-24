import { Calendar, Clock3 } from "lucide-react";

import { Badge } from "src/components/ui/badge";
import { type PostDetailItem } from "src/types/post";
import { getRenderedDate } from "src/utils/date";

type Props = {
  postItem: PostDetailItem;
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
          <Calendar size={14} strokeWidth={1.2} />
          <span>{getRenderedDate(postItem.createDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock3 size={14} strokeWidth={1.2} />
          <span>{postItem.readTime}</span>
        </div>
      </div>
    </section>
  );
};

export default PostTitle;
