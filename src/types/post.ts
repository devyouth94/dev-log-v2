export type PostStatus = "Published" | "Draft" | "Archived";

export type Post = {
  category: string;
  createDate: number;
  id: string;
  slug: string;
  status: PostStatus;
  summary: string;
  thumbnail: string | null;
  title: string;
};

export type PostDetailItem = Post & {
  readTime: string;
};
