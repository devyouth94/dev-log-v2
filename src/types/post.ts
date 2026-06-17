export type IPostStatus = "Published" | "Draft";

export type IPostItem = {
  category: string;
  createDate: number;
  id: string;
  slug: string;
  status: IPostStatus;
  summary: string;
  thumbnail: string | null;
  title: string;
};

export type IPostDetailItem = IPostItem & {
  readTime: string;
};

export type ICategoryItem = {
  title: string;
  count: number;
};
