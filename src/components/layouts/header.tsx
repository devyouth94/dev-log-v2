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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-between p-8 font-roboto text-sm font-medium",
      )}
    >
      <p>youngzin.log</p>

      <ul className="absolute left-1/2 top-[23px] flex h-fit -translate-x-1/2 gap-1 rounded-full border border-dashed border-gray-950 p-1 uppercase backdrop-blur-sm">
        {ROUTES.map((route) => (
          <Link
            key={route.name}
            href={route.path}
            className={cn(
              isActiveRoute(pathname || "", route.path) &&
                "bg-gray-200 text-white",
              "rounded-full px-3 py-1 transition-colors hover:underline",
            )}
          >
            <li>{route.name}</li>
          </Link>
        ))}
      </ul>

      <section className="flex items-center gap-1 ">
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
    </header>
  );
};

export default Header;
