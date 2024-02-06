import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";

import { cn } from "~/utils/className";
import { ROUTES } from "~/utils/constants";

const Header = () => {
  const { pathname, push } = useRouter();
  const { scrollY } = useScroll();

  const isHome = pathname === "/";

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
        "h-header fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 font-roboto text-sm text-black transition-all",
        isHome && "text-white",
        !isTop && "bg-white/50 backdrop-blur-sm",
      )}
    >
      <span onClick={() => push("/")}>youngzin.log</span>

      <ul className="flex items-center gap-3">
        {Object.values(ROUTES).map((route) => (
          <li
            key={route}
            className={cn(
              "cursor-pointer hover:underline",
              pathname.includes(route) && "font-bold underline",
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