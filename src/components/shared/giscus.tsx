import Giscus from "@giscus/react";

const Comment = () => {
  return (
    <footer id="giscus-comment" className="mt-10 w-full max-w-content">
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
    </footer>
  );
};

export default Comment;
