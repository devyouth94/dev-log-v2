"use client";

import { type MouseEvent } from "react";
import { NotionRenderer as Renderer } from "react-notion-x";
import dynamic from "next/dynamic";
import Image from "next/image";
import { type ExtendedRecordMap } from "notion-types";

const Code = dynamic(
  () => import("react-notion-x/build/third-party/code").then((m) => m.Code),
  { ssr: false },
);

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection,
  ),
);

const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  { ssr: false },
);

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false },
);

type Props = {
  className?: string;
  recordMap: ExtendedRecordMap;
  renderCollection?: boolean;
  rootPageId?: string;
};

const EmptyCollection = () => null;

const handleSectionLinkClick = (event: MouseEvent<HTMLDivElement>) => {
  if (
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return;
  }

  const link = (event.target as Element).closest<HTMLAnchorElement>(
    ".notion-table-of-contents-item, .notion-hash-link",
  );
  const target = link?.hash
    ? document.getElementById(link.hash.slice(1))
    : null;

  if (!link || !target) return;

  event.preventDefault();
  window.history.replaceState(window.history.state, "", link.href);
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
};

const NotionRenderer = ({
  className,
  recordMap,
  renderCollection = true,
  rootPageId,
}: Props) => {
  return (
    <div onClick={handleSectionLinkClick}>
      <Renderer
        recordMap={recordMap}
        blockId={rootPageId}
        className={className}
        rootPageId={rootPageId}
        components={{
          Code,
          Collection: renderCollection ? Collection : EmptyCollection,
          Pdf,
          Modal,
          Image,
        }}
      />
    </div>
  );
};

export default NotionRenderer;
