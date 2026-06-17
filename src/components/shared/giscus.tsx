"use client";

import Giscus from "@giscus/react";

const Comment = () => {
  return (
    <section id="giscus-comment" className="max-w-content w-full pt-5">
      <Giscus
        repo="devyouth94/dev-log-v2"
        repoId="R_kgDOLHPTyw"
        category="General"
        categoryId="DIC_kwDOLHPTy84CcjjR"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="noborder_light"
        loading="eager"
        lang="ko"
      />
    </section>
  );
};

export default Comment;
