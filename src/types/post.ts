export type IPostStatus = "Public" | "Draft";

export type IPostItem = {
  category: string;
  createDate: number;
  contents: string;
  id: string;
  readTime: string;
  slug: string;
  status: IPostStatus;
  summary: string;
  tags: string[];
  thumbnail: string | null;
  title: string;
};

export type ITagItem = {
  title: string;
  count: number;
};

export type ICategoryItem = ITagItem;
