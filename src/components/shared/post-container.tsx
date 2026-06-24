"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import PostItem from "src/components/shared/post-item";
import { type Post } from "src/types/post";

type Props = {
  postList: Post[];
};

const PostContainer = ({ postList }: Props) => {
  const [search, setSearch] = useState("");
  const category = useSearchParams()?.get("category");

  const filteredList = useMemo(() => {
    return postList.filter(
      (item) =>
        (!category || category === item.category) &&
        (search.length <= 1 ||
          [item.title, item.summary, item.category].join("").includes(search)),
    );
  }, [postList, category, search]);

  return (
    <>
      <input
        placeholder="search"
        value={search}
        className="placeholder:font-roboto flex w-full border border-gray-400 px-4 py-2 text-sm outline-none placeholder:text-gray-400"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
        {filteredList.map((item) => (
          <PostItem key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default PostContainer;
