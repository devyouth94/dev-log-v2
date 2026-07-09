import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "src/utils/class-name";

type Props = {
  children: ReactNode;
  className?: string;
  href: string;
  priority?: boolean;
  sizes: string;
  thumbnail: string | null;
};

const HoverPreviewLink = ({
  children,
  className,
  href,
  priority,
  sizes,
  thumbnail,
}: Props) => {
  return (
    <Link href={href} className={cn("group relative", className)}>
      <div className="relative z-20 h-full">{children}</div>

      {!!thumbnail && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={thumbnail}
            alt=""
            sizes={sizes}
            priority={priority}
            fill
            className="object-cover opacity-0 transition-opacity duration-250 group-hover:opacity-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-250 group-hover:opacity-100" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-30 border border-gray-950 opacity-0 transition-opacity duration-250 group-hover:opacity-100">
        <span className="absolute top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 border border-gray-950 bg-white" />
        <span className="absolute top-0 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 border border-gray-950 bg-white" />
        <span className="absolute bottom-0 left-0 size-1.5 -translate-x-1/2 translate-y-1/2 border border-gray-950 bg-white" />
        <span className="absolute right-0 bottom-0 size-1.5 translate-x-1/2 translate-y-1/2 border border-gray-950 bg-white" />
      </div>
    </Link>
  );
};

export default HoverPreviewLink;
