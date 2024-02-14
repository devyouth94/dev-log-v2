import Image from "next/image";

type IProps = {
  thumbnail: string | null;
};

const ArticleCover = ({ thumbnail }: IProps) => {
  return (
    <section className="fixed top-16 -z-10 h-[200px] w-full">
      {thumbnail && (
        <Image
          src={thumbnail}
          alt={thumbnail}
          sizes="1024px"
          priority
          fill
          className="object-cover object-center brightness-50"
        />
      )}
    </section>
  );
};

export default ArticleCover;
