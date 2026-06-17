"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import PlaylistPanel from "src/components/shared/playlist-panel";
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
      <p className="font-roboto fixed top-8 left-8 z-50 hidden text-xs text-white mix-blend-difference md:block">
        youngzin.log
      </p>

      <ul className="font-roboto fixed top-6 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-dashed border-white bg-black/5 p-1 text-sm font-medium uppercase mix-blend-difference backdrop-blur-sm">
        {ROUTES.map((route) => (
          <Link key={route.name} href={route.path}>
            <li
              className={cn(
                "rounded-full px-3 py-1 text-white transition-colors hover:underline",
                isActiveRoute(pathname || "", route.path) &&
                  "bg-white/50 text-black backdrop-blur-sm",
              )}
            >
              {route.name}
            </li>
          </Link>
        ))}
      </ul>

      <PlaylistPanel />
    </>
  );
};

export default Header;
