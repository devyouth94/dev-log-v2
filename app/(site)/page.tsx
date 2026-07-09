"use client";

import { type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import Footer from "src/components/layouts/footer";
import { METADATA } from "src/utils/constants";
import { SITE_ORIGINS } from "src/utils/routes";

const IndexPage = () => {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const rotateY = (x - 50) / 4.5;
    const rotateX = (50 - y) / 5.5;

    card.style.setProperty("--x", `${x}%`);
    card.style.setProperty("--y", `${y}%`);
    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;

    card.style.setProperty("--x", "50%");
    card.style.setProperty("--y", "50%");
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <>
      <main className="flex min-h-dvh items-center justify-center bg-white px-6 py-28 perspective-[1000px]">
        <section
          aria-label="Profile Card"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="group relative aspect-5/8 w-full max-w-64 scale-100 rotate-x-(--rx,0deg) rotate-y-(--ry,0deg) overflow-hidden rounded-[18px] bg-white shadow-[0_22px_50px_rgb(0_0_0/16%),0_2px_0_rgb(0_0_0/12%),inset_0_1px_0_rgb(255_255_255/72%)] transition duration-300 ease-out hover:scale-115 hover:shadow-[0_28px_58px_rgb(0_0_0/18%),0_3px_0_rgb(0_0_0/12%),inset_0_1px_0_rgb(255_255_255/80%)] sm:max-w-72"
        >
          <div
            className="h-3/5 bg-no-repeat"
            style={{
              backgroundColor: "#f5f5f3",
              backgroundImage: "url('/images/profile-card-portrait.png')",
              backgroundPosition: "center 8%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "88% auto",
            }}
          />

          <div className="flex h-2/5 flex-col bg-gray-950 p-4 text-white">
            <h1 className="text-2xl leading-none font-black tracking-normal sm:text-3xl">
              {METADATA.meta.authors}
            </h1>
            <p className="font-roboto mt-1 text-sm font-light">
              Frontend Developer
            </p>

            <div className="mt-auto flex items-center gap-3">
              <a
                href={SITE_ORIGINS.resume}
                target="_blank"
                rel="noreferrer"
                aria-label="이력서 열기"
                className="font-roboto inline-flex w-fit items-center gap-1 text-sm font-light text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                resume
                <ArrowUpRight aria-hidden size={16} strokeWidth={1.8} />
              </a>
              <a
                href={SITE_ORIGINS.portfolio}
                target="_blank"
                rel="noreferrer"
                aria-label="포트폴리오 열기"
                className="font-roboto inline-flex w-fit items-center gap-1 text-sm font-light text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                portfolio
                <ArrowUpRight aria-hidden size={16} strokeWidth={1.8} />
              </a>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-42"
            style={{
              background:
                "radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.28), transparent 36%), conic-gradient(from 210deg at var(--x,50%) var(--y,50%), rgba(223,244,236,0.32), rgba(246,198,174,0.34), rgba(226,128,111,0.3), rgba(236,178,214,0.32), rgba(164,103,230,0.3), rgba(142,216,237,0.32), rgba(223,244,236,0.32))",
              maskImage:
                "radial-gradient(circle at var(--x,50%) var(--y,50%), black 0 12%, transparent 42%)",
              WebkitMaskImage:
                "radial-gradient(circle at var(--x,50%) var(--y,50%), black 0 12%, transparent 42%)",
            }}
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default IndexPage;
