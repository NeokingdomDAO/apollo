import { parseDate, STAGES } from "./utils";

type OdooTask = {
  id: string;
  user_id: [number, string];
  name: string;
  description: string;
  child_ids: number[];
  stage_id: [keyof typeof STAGES, string];
  parent_id: number;
  durations: { id: number }[];
  task_id: [number, string];
  project_id: [number, string];
  tier: [number, string];
  write_date: string;
};

export function parseTask(task: OdooTask) {
  const upstreamStage = STAGES[task.stage_id[0]];
  const stage = ["backlog", "progress"].includes(upstreamStage)
    ? "todo"
    : upstreamStage;
  const stages = new Set([stage]);
  return {
    id: task.id,
    userId: task.user_id[0],
    name: task.name,
    description: task.description,
    isTracking: false,
    isParentTask: task.child_ids.length > 0 && !task.parent_id,
    isSingleTask: task.child_ids.length === 0 && !task.parent_id,
    isSubtask: !!task.parent_id,
    subtaskIds: task.child_ids,
    hasSubtasks: task.child_ids.length > 0,
    hasDurations: task.durations?.length > 0,
    parentId: task.task_id ? task.task_id[0] : null,
    durations: task.durations?.map((duration) => duration.id),
    projectId: task.project_id[0],
    projectName: task.project_id[1],
    tier: task.tier && task.tier[1],
    tierId: task.tier && task.tier[0],
    lastUpdate: parseDate(task.write_date),
    lastActivity: 0,
    stage,
    stages,
  };
}
