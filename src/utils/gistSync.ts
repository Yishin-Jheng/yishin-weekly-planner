import type {
  PlannerState,
  FrictionEntry,
  DailyTodoEntry,
  SprintMilestone,
} from "../types";

export const GIST_TOKEN_KEY = "wendy_gist_token";
export const GIST_ID_KEY = "wendy_gist_id";

const GIST_FILENAME = "weekly-planner-data.json";

export interface GistData {
  state: PlannerState;
  checkinLog: Record<string, boolean>;
  frictionLogs: Record<string, FrictionEntry[]>;
  dailyTodos: Record<string, DailyTodoEntry[]>;
  milestones: Record<string, SprintMilestone>;
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

export async function fetchFromGist(
  token: string,
  gistId: string,
): Promise<GistData> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const gist = await res.json();
  const content = gist.files?.[GIST_FILENAME]?.content;
  if (!content) throw new Error("找不到 Gist 資料檔案");
  return JSON.parse(content);
}

export async function saveToGist(
  token: string,
  gistId: string,
  data: GistData,
): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) },
      },
    }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
}

export async function createGist(
  token: string,
  data: GistData,
): Promise<string> {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      description: "Weekly Planner Data",
      public: false,
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) },
      },
    }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const gist = await res.json();
  return gist.id as string;
}

export async function verifyToken(token: string): Promise<boolean> {
  const res = await fetch("https://api.github.com/user", {
    headers: headers(token),
  });
  return res.ok;
}
