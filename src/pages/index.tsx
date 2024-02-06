import { GetStaticProps, InferGetStaticPropsType } from "next";

import Three from "~/components/home/three";
import Footer from "~/components/layouts/footer";

import { getYoutubaData } from "~/apis/youtube";
import { IPlaylistItem } from "~/types/youtube";
import { getPlayList } from "~/utils/dataFormat";

const Index = ({
  playlist,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Three />
      <Footer playlist={playlist} />
    </>
  );
};

export default Index;

export const getStaticProps = (async () => {
  const data = await getYoutubaData();
  const playlist = getPlayList(data);

  return {
    props: {
      playlist,
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps<{ playlist: IPlaylistItem[] }>;
