import Image from "next/image";
import Link from "next/link";

import { Badge } from "src/components/ui/badge";
import { type IPostItem } from "src/types/post";
import { getRenderedDate } from "src/utils/date";

type Props = {
  item: IPostItem;
};

const PostItem = ({ item }: Props) => {
  return (
    <Link href={`/post/${item.slug}`} key={item.id}>
      <article
        key={item.id}
        className="group relative h-[136px] overflow-hidden border-b border-gray-950 px-3 py-5"
      >
        <div className="relative z-20 flex h-full flex-col justify-between">
          <div className="flex justify-between">
            <Badge className="group-hover:bg-gray-950 group-hover:text-white">
              {item.category}
            </Badge>

            <span className="font-roboto text-xs font-normal transition-colors duration-500 group-hover:text-white">
              {getRenderedDate(item.createDate)}
            </span>
          </div>

          <p className="transition-colors duration-500 group-hover:text-white">
            <span className="text-xl font-bold">{item.title}</span>
            {!!item.summary && (
              <span className="mt-1 block truncate text-sm">
                {item.summary}
              </span>
            )}
          </p>
        </div>

        <div className="absolute inset-0 z-10 bg-white transition-transform duration-500 group-hover:-translate-y-full" />

        {!!item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.thumbnail}
            sizes="800px"
            priority
            fill
            className="object-cover brightness-50"
          />
        )}
      </article>
    </Link>
  );
};

export default PostItem;
