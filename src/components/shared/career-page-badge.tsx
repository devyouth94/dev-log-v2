import { Badge } from "src/components/ui/badge";
import { getRenderedDate } from "src/utils/date";

type CareerPageBadgeProps = {
  jobSearchStatus: string | null;
  lastEditedTime: number | null;
};

const CareerPageBadge = ({
  jobSearchStatus,
  lastEditedTime,
}: CareerPageBadgeProps) => {
  if (!jobSearchStatus && !lastEditedTime) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
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
