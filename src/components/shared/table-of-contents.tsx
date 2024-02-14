import { ListIcon } from "lucide-react";
import { useRouter } from "next/router";
import { TableOfContentsEntry } from "notion-utils";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { cn } from "~/utils/class-name";
import getIntersectionObserver from "~/utils/get-intersection-observer";

const TocButton = ({ toc }: { toc: TableOfContentsEntry[] }) => {
  const { replace, pathname } = useRouter();

  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(toc[0].id);

  useEffect(() => {
    const observer = getIntersectionObserver(setCurrentId);
    const els = Array.from(document.querySelectorAll(".notion-h"));

    els.map((content) => {
      observer.observe(content);
    });
  }, [pathname]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <ListIcon size={14} absoluteStrokeWidth strokeWidth={1} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 text-sm font-extralight">
        {toc.map(({ id, indentLevel, text }) => (
          <div
            key={id}
            onClick={() => {
              replace(`#${id}`);
              setOpen(false);
            }}
            className={cn(
              "cursor-pointer py-1 text-gray-400",
              id === currentId && "text-black",
              indentLevel === 0 && "font-normal",
              indentLevel === 1 && "border-l pl-3",
              indentLevel === 2 && "border-l pl-6",
            )}
          >
            {text}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default TocButton;
