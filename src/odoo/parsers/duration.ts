import { parseDate } from "./utils";

type OdooDuration = {
  id: string;
  task_id: [number, string];
  start: string;
  end: string;
  unit_amount: number;
  name: string;
};

export function parseDuration(duration: OdooDuration) {
  return {
    id: duration.id,
    taskId: duration.task_id[0],
    start: parseDate(duration.start),
    end: parseDate(duration.end),
    hours: duration.unit_amount,
    description: duration.name,
  };
}
