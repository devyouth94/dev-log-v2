import Image from "next/image";

import Clock from "src/components/shared/clock";
import CurrentYear from "src/components/shared/current-year";

const Footer = () => {
  return (
    <footer className="font-roboto fixed inset-x-0 bottom-0 p-8 text-xs leading-none uppercase">
      <div className="grid w-fit grid-cols-[32px_1fr] border border-black">
        <div className="flex items-center justify-center border-r border-black">
          <span className="-rotate-90 text-xs">
            <span className="font-pretendard">©</span>
            <CurrentYear />
          </span>
        </div>

        <div className="flex flex-col justify-center gap-1 px-3 py-3.5">
          <span>seoul, korea</span>
          <Clock />
        </div>

        <div className="col-span-2 flex items-center justify-center border-t border-black p-2">
          <a
            target="_blank"
            href="https://github.com/devyouth94"
            className="flex items-center gap-1 hover:underline"
          >
            <Image src="/github.svg" alt="" width={14} height={14} />
            <span>devyouth94</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
