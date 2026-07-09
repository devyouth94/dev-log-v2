import HoverPreviewLink from "src/components/shared/hover-preview-link";
import { Badge } from "src/components/ui/badge";
import { type Post } from "src/types/post";
import { getRenderedDate } from "src/utils/date";
import { getPostPath } from "src/utils/routes";

type Props = {
  item: Post;
};

const PostItem = ({ item }: Props) => {
  return (
    <HoverPreviewLink
      href={getPostPath(item.slug)}
      priority
      sizes="800px"
      thumbnail={item.thumbnail}
      className="h-34 px-3 py-5"
    >
      <article className="h-full">
        <div className="flex h-full flex-col justify-between">
          <div className="flex justify-between">
            <Badge className="duration-250 group-hover:bg-gray-950 group-hover:text-white">
              {item.category}
            </Badge>

            <span className="font-roboto text-xs font-normal transition-colors duration-250 group-hover:text-white">
              {getRenderedDate(item.createDate)}
            </span>
          </div>

          <p className="transition-colors duration-250 group-hover:text-white">
            <span className="line-clamp-1 text-xl font-bold">{item.title}</span>
            {!!item.summary && (
              <span className="mt-1 line-clamp-1 text-sm">{item.summary}</span>
            )}
          </p>
        </div>

      </article>
    </HoverPreviewLink>
  );
};

export default PostItem;
