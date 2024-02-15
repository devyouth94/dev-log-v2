import { TableOfContentsEntry } from "notion-utils";
import { useState } from "react";

import Icon from "~/components/shared/icon";
import TocButton from "~/components/shared/table-of-contents";
import { Button } from "~/components/ui/button";

import { cn } from "~/utils/class-name";

type IProps = {
  toc: TableOfContentsEntry[];
};

const ArticleButton = ({ toc }: IProps) => {
  const [isClip, setIsClip] = useState(false);

  const onClickToTop = () => {
    window.scrollTo({ top: 0 });
  };

  const onClickToComment = () => {
    document
      .getElementById("giscus-comment")
      ?.scrollIntoView({ block: "center" });
  };

  const onClickCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setIsClip(true);

    setTimeout(() => {
      setIsClip(false);
    }, 1000);
  };

  return (
    <div className="sticky right-4 top-16 z-30 flex w-full max-w-content justify-end gap-1 pt-4">
      <TocButton toc={toc} />

      <Button variant="outline" size="icon" onClick={onClickToTop}>
        <Icon name="CornerRightUp" />
      </Button>

      <Button variant="outline" size="icon" onClick={onClickToComment}>
        <Icon name="MessageSquareMore" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "disabled:opacity-100",
          isClip && "bg-black transition-colors hover:bg-black",
        )}
        onClick={onClickCopy}
        disabled={isClip}
      >
        <Icon
          name="Share2"
          className={cn(isClip && "hidden opacity-0 transition-all")}
        />
        <Icon
          name="Check"
          size={18}
          className={cn(
            "text-white",
            !isClip && "hidden opacity-0 transition-all",
          )}
        />
      </Button>
    </div>
  );
};

export default ArticleButton;
