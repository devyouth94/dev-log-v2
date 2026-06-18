import { type PostStatus } from "src/types/post";

export type PortfolioEntry = {
  id: string;
  period: number | number[] | null;
  slug: string;
  stacks: string[];
  status: PostStatus;
  summary: string;
  title: string;
};
