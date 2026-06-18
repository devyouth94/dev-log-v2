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
    <header className="contents">
      <p className="font-roboto fixed top-8 left-8 z-50 hidden text-xs text-white mix-blend-difference md:block">
        youngzin.log
      </p>

      <ul className="font-roboto fixed top-6 left-1/2 z-50 flex -translate-x-1/2 gap-1 border border-dashed border-gray-950 bg-white/60 p-1 text-sm font-medium uppercase backdrop-blur-sm">
        {ROUTES.map((route) => (
          <Link key={route.name} href={route.path}>
            <li
              className={cn(
                "px-3 py-1 text-gray-950 transition-colors hover:underline",
                isActiveRoute(pathname || "", route.path) &&
                  "bg-gray-950 text-white",
              )}
            >
              {route.name}
            </li>
          </Link>
        ))}
      </ul>

      <PlaylistPanel />
    </header>
  );
};

export default Header;
