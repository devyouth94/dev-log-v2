"use client";

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

type IProps = {
  recordMap: ExtendedRecordMap;
};

const NotionRenderer = ({ recordMap }: IProps) => {
  return (
    <Renderer
      recordMap={recordMap}
      components={{ Code, Collection, Pdf, Modal, Image }}
    />
  );
};

export default NotionRenderer;
