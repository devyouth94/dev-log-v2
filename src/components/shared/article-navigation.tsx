import { useRouter } from "next/router";

import Icon from "~/components/shared/icon";
import { Separator } from "~/components/ui/separator";

import { IPostItem } from "~/types/post";

type IProps = {
  pathname: "post" | "note";
  prevNextPost: Record<string, IPostItem | null>;
};

const ArticleNavigation = ({ pathname, prevNextPost }: IProps) => {
  const { push } = useRouter();

  const prev = prevNextPost["prev"];
  const next = prevNextPost["next"];

  return (
    <>
      <Separator className="mb-2 mt-20" />
      <section className="grid w-full grid-cols-2 text-pretty text-sm text-gray-400">
        <div
          onClick={prev ? () => push(`/${pathname}/${prev?.slug}`) : undefined}
          className="flex cursor-pointer flex-col gap-1 transition-colors hover:text-black"
        >
          {prev && (
            <>
              <Icon name="ArrowLeft" />
              <span>{prev?.title}</span>
            </>
          )}
        </div>
        <div
          onClick={next ? () => push(`/${pathname}/${next?.slug}`) : undefined}
          className="flex cursor-pointer flex-col items-end gap-1 transition-colors hover:text-black"
        >
          {next && (
            <>
              <Icon name="ArrowRight" />
              <span className="text-right">{next?.title}</span>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ArticleNavigation;
