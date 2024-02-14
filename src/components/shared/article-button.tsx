import { TableOfContentsEntry } from "notion-utils";

import Icon from "~/components/shared/icon";
import TocButton from "~/components/shared/table-of-contents";
import { Button } from "~/components/ui/button";

type IProps = {
  toc: TableOfContentsEntry[];
};

const ArticleButton = ({ toc }: IProps) => {
  const onClickToTop = () => {
    window.scrollTo({ top: 0 });
  };

  const onClickToComment = () => {
    document
      .getElementById("giscus-comment")
      ?.scrollIntoView({ block: "center" });
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
    </div>
  );
};

export default ArticleButton;
