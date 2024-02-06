import { ArrowUpRight, Disc3, LucideProps } from "lucide-react";

const ICON = {
  ArrowUpRight,
  Disc3,
};

type IProps = {
  name: keyof typeof ICON;
} & LucideProps;

const Icon = ({
  name,
  size = 14,
  absoluteStrokeWidth = true,
  strokeWidth = 1,
  className,
  ...props
}: IProps) => {
  const Icon = ICON[name];

  return (
    <Icon
      size={size}
      absoluteStrokeWidth={absoluteStrokeWidth}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
};

export default Icon;
