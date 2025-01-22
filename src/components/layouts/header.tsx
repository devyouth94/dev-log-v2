"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Icon from "src/components/shared/icon";
import { cn } from "src/utils/class-name";

const ROUTES = [
  { name: "home", path: "/" },
  { name: "post", path: "/post" },
];

const isActiveRoute = (pathname: string, routePath: string) => {
  if (routePath === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(routePath);
};

const Header = () => {
  const pathname = usePathname();

  return (
    <>
      <p className="fixed left-8 top-8 z-50 hidden font-roboto text-sm font-medium text-white mix-blend-difference md:block">
        youngzin.log
      </p>

      <ul className="fixed left-1/2 top-[23px] z-50 flex -translate-x-1/2 gap-1 rounded-full border border-dashed border-white bg-black/5 p-1 font-roboto text-sm font-medium uppercase mix-blend-difference backdrop-blur-sm">
        {ROUTES.map((route) => (
          <Link key={route.name} href={route.path}>
            <li
              className={cn(
                "rounded-full px-3 py-1 text-white mix-blend-difference transition-colors hover:underline",
                isActiveRoute(pathname || "", route.path) &&
                  "bg-white/50 text-black backdrop-blur-sm",
              )}
            >
              {route.name}
            </li>
          </Link>
        ))}
      </ul>

      <section className="fixed right-8 top-8 z-50 hidden items-center gap-1 font-roboto text-sm font-medium text-white mix-blend-difference md:flex">
        <a
          target="_blank"
          href="https://music.youtube.com/playlist?list=PLsVcTYdAdbedwl_BNs7NIGOhzUoU2XWlD&si=fEezG3YQlSMdZzYR"
          className="hover:underline"
        >
          playlist
        </a>
        <Icon
          name="Disc3"
          size={16}
          strokeWidth={1.5}
          className="animate-spin"
        />
      </section>
    </>
  );
};

export default Header;
