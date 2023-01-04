export const STAGES = {
  29: "backlog",
  30: "progress",
  31: "done",
  32: "approved",
} as const;

export function parseDate(s: string) {
  return s ? new Date(s.replace(" ", "T") + "Z") : false;
}
