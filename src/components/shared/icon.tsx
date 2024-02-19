import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Clock3,
  CornerRightUp,
  Disc3,
  Loader,
  MessageSquareMore,
  Share2,
  X,
  type LucideProps,
} from "lucide-react";

const ICON = {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Clock3,
  CornerRightUp,
  Disc3,
  Loader,
  MessageSquareMore,
  Share2,
  X,
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
