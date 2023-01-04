type OdooProject = {
  id: string;
  name: string;
  sequence: string;
  task_ids: number[];
};

export function parseProject(project: OdooProject) {
  return {
    id: project.id,
    name: project.name,
    sequence: project.sequence,
    taskIds: project.task_ids,
    isTracking: false,
    stages: new Set(),
    stagesCount: {
      todo: 0,
      done: 0,
    },
  };
}
