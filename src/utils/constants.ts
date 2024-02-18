import { Variants } from "framer-motion";

export const PLAYLIST_ID = "PLsVcTYdAdbedwl_BNs7NIGOhzUoU2XWlD";

export const NOTION_PAGE_IDS = {
  post: "59404ced87454e5688254418bdb0b193",
  note: "f05f71c15d964c54b64c3f9e0035327e",
  resume: "68711cc1deed4ff1b7da2c0f32697315",
};

export const ROUTES = {
  post: "post",
  note: "note",
  resume: "resume",
} as const;

export const SCHEMA_LIST = [
  "tags",
  "createDate",
  "status",
  "category",
  "title",
  "summary",
  "slug",
];

export const METADATA = {
  meta: {
    url: "https://youngzin-log.com",
    title: "youngzin.log",
    description: "개발 기록",
    authors: "KIM YOUNGJIN",
  },
};

export const fadeVariants: Variants = {
  visible: {
    y: -5,
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
};

export const fadeParentVariants: Variants = {
  ...fadeVariants,
  visible: {
    ...fadeVariants.visible,
    transition: { duration: 0.5, delayChildren: 0.1, staggerChildren: 0.1 },
  },
};
