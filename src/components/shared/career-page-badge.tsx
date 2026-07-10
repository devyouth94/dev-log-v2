import { Badge } from "src/components/ui/badge";
import { cn } from "src/utils/class-name";
import { getRenderedDate } from "src/utils/date";

type CareerPageBadgeProps = {
  className?: string;
  jobSearchStatus: string | null;
  lastEditedTime: number | null;
};

const CareerPageBadge = ({
  className,
  jobSearchStatus,
  lastEditedTime,
}: CareerPageBadgeProps) => {
  if (!jobSearchStatus && !lastEditedTime) return null;

  return (
    <div className={cn("mb-4 flex flex-wrap gap-2", className)}>
      {!!jobSearchStatus && (
        <Badge variant={jobSearchStatus === "구직중" ? "full" : "secondary"}>
          {jobSearchStatus}
        </Badge>
      )}
      {!!lastEditedTime && (
        <Badge variant="default">
          최종 수정 {getRenderedDate(lastEditedTime)}
        </Badge>
      )}
    </div>
  );
};

export default CareerPageBadge;
