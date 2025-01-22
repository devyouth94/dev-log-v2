"use client";

import { useState } from "react";

import PostItem from "src/components/shared/post-item";
import { Input } from "src/components/ui/input";
import useFilteredList from "src/hooks/use-filtered-list";
import { type IPostItem } from "src/types/post";

type Props = {
  postList: IPostItem[];
};

const PostContainer = ({ postList }: Props) => {
  const [search, setSearch] = useState("");

  const { filteredList } = useFilteredList(postList, search);

  return (
    <>
      <Input
        placeholder="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        {filteredList.map((item) => (
          <PostItem key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default PostContainer;
