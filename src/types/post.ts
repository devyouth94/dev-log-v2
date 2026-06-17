export type PostStatus = "Published" | "Draft";

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

export type CategoryItem = {
  title: string;
  count: number;
};
