import { type PostStatus } from "src/types/post";

export type PortfolioEntry = {
  category: string;
  featured: boolean;
  id: string;
  period: number | number[] | null;
  slug: string;
  stacks: string[];
  status: PostStatus;
  summary: string;
  thumbnail: string | null;
  title: string;
};
