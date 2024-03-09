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
      <PopoverContent
        align="center"
        sideOffset={4}
        className="w-60 overflow-y-auto border border-solid border-gray-50 px-5 text-sm max-sm:max-h-[50vh]"
      >
        {toc.map(({ id, indentLevel, text }) => (
          <div
            key={id}
            onClick={() => {
              replace(`#${id}`);
              setOpen(false);
            }}
            className={cn(
              "cursor-pointer py-1.5 text-gray-500",
              id === currentId && "font-normal text-black transition-colors",
              indentLevel === 1 && "border-l pl-3",
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
