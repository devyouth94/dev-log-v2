import { useRouter } from "next/router";

import { cn } from "~/utils/className";

interface IProps {
  variants?: "light" | "dark";
}

const Header = ({ variants = "dark" }: IProps) => {
  const { pathname, push } = useRouter();

  return (
    <header
      className={cn(
        "font-roboto fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between px-8 text-sm font-extralight",
        variants === "light" ? "text-white" : "text-black",
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
