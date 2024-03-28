import Image from "next/image";

type IProps = {
  thumbnail: string | null;
};

const ArticleCover = ({ thumbnail }: IProps) => {
  return (
    <section className="fixed top-16 -z-10 h-[200px] w-full md:h-[300px]">
      {thumbnail && (
        <Image
          src={thumbnail}
          alt={thumbnail}
          sizes="1500px"
          priority
          fill
          className="object-cover object-center"
        />
      )}
    </section>
  );
};

export default ArticleCover;
