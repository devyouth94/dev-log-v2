import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";

import { cn } from "~/utils/className";

interface IProps {
  variants?: "light" | "dark";
}

const Header = ({ variants = "dark" }: IProps) => {
  const { pathname, push } = useRouter();
  const { scrollY } = useScroll();

  const [isTop, setIsTop] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest === 0) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  });

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-transparent px-8 font-roboto text-sm font-extralight transition-all",
        variants === "light" ? "text-white" : "text-black",
        !isTop &&
          (variants === "light"
            ? "bg-black/50 backdrop-blur-md"
            : "bg-white/50 backdrop-blur-md"),
      )}
    >
      <span className="cursor-pointer" onClick={() => push("/")}>
        youngjin.log
      </span>

      <ul className="flex items-center gap-5">
        {ROUTES.map((route) => (
          <li
            key={route}
            className={cn(
              "cursor-pointer text-gray-400 hover:underline",
              pathname.includes(route) &&
                (variants === "light"
                  ? "text-white underline"
                  : "text-black underline"),
            )}
            onClick={() => push(`/${route}`)}
          >
            {route}
          </li>
        ))}
      </ul>
    </header>
  );
};

export default Header;

const ROUTES = ["post", "note", "resume"];
