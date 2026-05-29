import { useState, useCallback, useEffect, useRef } from "react";
import type { WeekId, PlannerState, FrictionEntry, DailyTodoEntry, SprintMilestone } from "./types";
import { buildSprintConfig, getSprintDateRange } from "./utils/sprintDates";
import { fetchFromGist, saveToGist, GIST_TOKEN_KEY, GIST_ID_KEY } from "./utils/gistSync";
import type { GistData } from "./utils/gistSync";
import Header from "./components/Header";
import WeekTabs from "./components/WeekTabs";
import RestWeekPanel from "./components/panels/RestWeekPanel";
import Sprint0Panel from "./components/panels/Sprint0Panel";
import SprintPanel from "./components/panels/SprintPanel";
import GistSettings from "./components/GistSettings";
import type { SyncStatus } from "./components/GistSettings";

const STORAGE_KEY = "wendy_plan_v1";
const CHECKIN_KEY = "checkin_log";
const FRICTION_KEY = "wendy_friction_v1";
const DAILY_TODOS_KEY = "wendy_daily_todos_v1";
const MILESTONES_KEY = "wendy_milestones_v1";
const DEFAULT_SPRINTS = [1, 2, 3, 4];

// 放空週與 Sprint 0 為固定分頁，不參與動態管理
const FIXED_TABS = [
  { id: "rest", label: "放空週", dateRange: "5/6 – 5/15" },
  { id: "sprint0", label: "Sprint 0", dateRange: "5/18 – 5/22" },
];

function loadState(): PlannerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);

      // 舊格式 migration（extraSprints + hiddenSprints → sprints）
      if ("extraSprints" in parsed || "hiddenSprints" in parsed) {
        const extra: number[] = parsed.extraSprints ?? [];
        const hidden: string[] = parsed.hiddenSprints ?? [];
        const sprints = [...DEFAULT_SPRINTS, ...extra].filter(
          (n) => !hidden.includes(`sprint${n}`),
        );
        return {
          checkboxes: parsed.checkboxes ?? {},
          textAreas: parsed.textAreas ?? {},
          selects: parsed.selects ?? {},
          sprints,
          minWins: parsed.minWins ?? {},
        };
      }

      return {
        checkboxes: parsed.checkboxes ?? {},
        textAreas: parsed.textAreas ?? {},
        selects: parsed.selects ?? {},
        sprints: parsed.sprints ?? DEFAULT_SPRINTS,
        minWins: parsed.minWins ?? {},
      };
    }
  } catch {}
  return {
    checkboxes: {},
    textAreas: {},
    selects: {},
    sprints: DEFAULT_SPRINTS,
    minWins: {},
  };
}

function loadFrictionLogs(): Record<string, FrictionEntry[]> {
  try {
    const raw = localStorage.getItem(FRICTION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadCheckinLog(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKIN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadDailyTodos(): Record<string, DailyTodoEntry[]> {
  try {
    const raw = localStorage.getItem(DAILY_TODOS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadMilestones(): Record<string, SprintMilestone> {
  try {
    const raw = localStorage.getItem(MILESTONES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export default function App() {
  const [activeWeek, setActiveWeek] = useState<WeekId>("rest");
  const [state, setState] = useState<PlannerState>(loadState);
  const [checkinLog, setCheckinLog] =
    useState<Record<string, boolean>>(loadCheckinLog);
  const [frictionLogs, setFrictionLogs] =
    useState<Record<string, FrictionEntry[]>>(loadFrictionLogs);
  const [dailyTodos, setDailyTodos] =
    useState<Record<string, DailyTodoEntry[]>>(loadDailyTodos);
  const [milestones, setMilestones] =
    useState<Record<string, SprintMilestone>>(loadMilestones);

  // Gist 同步相關狀態
  const [gistToken, setGistToken] = useState(() => localStorage.getItem(GIST_TOKEN_KEY) ?? "");
  const [gistId, setGistId] = useState(() => localStorage.getItem(GIST_ID_KEY) ?? "");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // 用來跳過 Gist 載入後觸發的自動儲存
  const skipNextSyncRef = useRef(false);

  // 啟動時從 Gist 載入資料
  useEffect(() => {
    const token = localStorage.getItem(GIST_TOKEN_KEY);
    const id = localStorage.getItem(GIST_ID_KEY);
    if (!token || !id) return;

    skipNextSyncRef.current = true;
    fetchFromGist(token, id)
      .then((data) => {
        setState(data.state);
        setCheckinLog(data.checkinLog);
        setFrictionLogs(data.frictionLogs);
        setDailyTodos(data.dailyTodos);
        setMilestones(data.milestones);
        setSyncStatus("synced");
        setSyncError(null);
        // 等 React 重新渲染後再解除跳過旗標
        setTimeout(() => { skipNextSyncRef.current = false; }, 100);
      })
      .catch((e) => {
        setSyncStatus("error");
        setSyncError(e instanceof Error ? e.message : "載入失敗");
        skipNextSyncRef.current = false;
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // localStorage 同步
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  useEffect(() => {
    try { localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkinLog)); } catch {}
  }, [checkinLog]);

  useEffect(() => {
    try { localStorage.setItem(FRICTION_KEY, JSON.stringify(frictionLogs)); } catch {}
  }, [frictionLogs]);

  useEffect(() => {
    try { localStorage.setItem(DAILY_TODOS_KEY, JSON.stringify(dailyTodos)); } catch {}
  }, [dailyTodos]);

  useEffect(() => {
    try { localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones)); } catch {}
  }, [milestones]);

  // Gist 自動同步（3 秒 debounce）
  useEffect(() => {
    if (!gistToken || !gistId) return;
    if (skipNextSyncRef.current) return;

    setSyncStatus("syncing");
    const timer = setTimeout(async () => {
      try {
        await saveToGist(gistToken, gistId, {
          state,
          checkinLog,
          frictionLogs,
          dailyTodos,
          milestones,
        });
        setSyncStatus("synced");
        setSyncError(null);
      } catch (e) {
        setSyncStatus("error");
        setSyncError(e instanceof Error ? e.message : "同步失敗");
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, checkinLog, frictionLogs, dailyTodos, milestones]);

  const getCurrentData = useCallback((): GistData => ({
    state,
    checkinLog,
    frictionLogs,
    dailyTodos,
    milestones,
  }), [state, checkinLog, frictionLogs, dailyTodos, milestones]);

  const handleGistConnect = useCallback((token: string, id: string) => {
    setGistToken(token);
    setGistId(id);
    setSyncStatus("synced");
    setSyncError(null);
    setShowSettings(false);
  }, []);

  const handleGistDisconnect = useCallback(() => {
    setGistToken("");
    setGistId("");
    setSyncStatus("idle");
    setSyncError(null);
  }, []);

  const handleLoadFromGist = useCallback((data: GistData) => {
    skipNextSyncRef.current = true;
    setState(data.state);
    setCheckinLog(data.checkinLog);
    setFrictionLogs(data.frictionLogs);
    setDailyTodos(data.dailyTodos);
    setMilestones(data.milestones);
    setTimeout(() => { skipNextSyncRef.current = false; }, 100);
  }, []);

  const onToggle = useCallback((date: string) => {
    setCheckinLog((prev) => ({ ...prev, [date]: !prev[date] }));
  }, []);

  const setCheckbox = useCallback((key: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      checkboxes: { ...prev.checkboxes, [key]: checked },
    }));
  }, []);

  const setTextarea = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      textAreas: { ...prev.textAreas, [key]: value },
    }));
  }, []);

  const setSelect = useCallback((key: string, index: number) => {
    setState((prev) => ({
      ...prev,
      selects: { ...prev.selects, [key]: index },
    }));
  }, []);

  const setMinWin = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      minWins: { ...prev.minWins, [key]: value },
    }));
  }, []);

  const addFrictionEntry = useCallback(
    (sprintId: string, entry: Omit<FrictionEntry, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setFrictionLogs((prev) => ({
        ...prev,
        [sprintId]: [{ ...entry, id }, ...(prev[sprintId] ?? [])],
      }));
    },
    [],
  );

  const addDailyTodo = useCallback(
    (dayKey: string, text: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setDailyTodos((prev) => ({
        ...prev,
        [dayKey]: [...(prev[dayKey] ?? []), { id, text, checked: false }],
      }));
    },
    [],
  );

  const toggleDailyTodo = useCallback(
    (dayKey: string, id: string, checked: boolean) => {
      setDailyTodos((prev) => ({
        ...prev,
        [dayKey]: (prev[dayKey] ?? []).map((e) =>
          e.id === id ? { ...e, checked } : e,
        ),
      }));
    },
    [],
  );

  const deleteDailyTodo = useCallback(
    (dayKey: string, id: string) => {
      setDailyTodos((prev) => ({
        ...prev,
        [dayKey]: (prev[dayKey] ?? []).filter((e) => e.id !== id),
      }));
    },
    [],
  );

  const setMilestone = useCallback(
    (sprintId: string, text: string) => {
      setMilestones((prev) => ({
        ...prev,
        [sprintId]: { text, completed: false },
      }));
    },
    [],
  );

  const completeMilestone = useCallback(
    (sprintId: string) => {
      setMilestones((prev) => {
        const current = prev[sprintId];
        if (!current) return prev;
        return { ...prev, [sprintId]: { ...current, completed: true, deferred: false } };
      });
    },
    [],
  );

  const deferMilestone = useCallback(
    (sprintId: string) => {
      setMilestones((prev) => {
        const current = prev[sprintId];
        if (!current) return prev;
        return { ...prev, [sprintId]: { ...current, deferred: true, completed: false } };
      });
    },
    [],
  );

  const resetMilestone = useCallback(
    (sprintId: string) => {
      setMilestones((prev) => {
        const next = { ...prev };
        delete next[sprintId];
        return next;
      });
    },
    [],
  );

  const deleteFrictionEntry = useCallback(
    (sprintId: string, entryId: string) => {
      setFrictionLogs((prev) => ({
        ...prev,
        [sprintId]: (prev[sprintId] ?? []).filter((e) => e.id !== entryId),
      }));
    },
    [],
  );

  const nextSprintNumber =
    state.sprints.length > 0 ? Math.max(...state.sprints) + 1 : 1;

  const addNextSprint = useCallback(() => {
    const n = state.sprints.length > 0 ? Math.max(...state.sprints) + 1 : 1;
    setState((prev) => ({ ...prev, sprints: [...prev.sprints, n] }));
    setActiveWeek(`sprint${n}`);
  }, [state.sprints]);

  const allTabs = [
    ...FIXED_TABS,
    ...state.sprints.map((n) => ({
      id: `sprint${n}`,
      label: `Sprint ${n}`,
      dateRange: getSprintDateRange(n),
    })),
  ];

  const deletableTabIds = new Set(
    allTabs.map((t) => t.id).filter((id) => id !== "rest" && id !== "sprint0"),
  );

  const deleteTab = useCallback(
    (id: string) => {
      const n = parseInt(id.replace("sprint", ""));

      setState((prev) => {
        const sprints = prev.sprints.filter((num) => num !== n);

        const sprintPrefix = `sprint${n}_`;
        const textareaIds = [
          `journal-sprint${n}`,
          `review-sprint${n}`,
          `adjust-sprint${n}`,
        ];

        const checkboxes = Object.fromEntries(
          Object.entries(prev.checkboxes).filter(
            ([k]) => !k.startsWith(sprintPrefix),
          ),
        );
        const textAreas = Object.fromEntries(
          Object.entries(prev.textAreas).filter(
            ([k]) => !textareaIds.includes(k),
          ),
        );
        const selects = Object.fromEntries(
          Object.entries(prev.selects).filter(
            ([k]) => !k.startsWith(sprintPrefix),
          ),
        );
        const minWins = Object.fromEntries(
          Object.entries(prev.minWins).filter(
            ([k]) => !k.startsWith(sprintPrefix),
          ),
        );

        return { ...prev, sprints, checkboxes, textAreas, selects, minWins };
      });

      setFrictionLogs((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      setDailyTodos((prev) => {
        const prefix = `sprint${n}_d`;
        return Object.fromEntries(
          Object.entries(prev).filter(([k]) => !k.startsWith(prefix)),
        );
      });

      if (activeWeek === id) {
        const idx = allTabs.findIndex((t) => t.id === id);
        setActiveWeek(allTabs[idx > 0 ? idx - 1 : 0].id);
      }
    },
    [activeWeek, allTabs],
  );

  const allSprintConfigs = state.sprints.map((n) => buildSprintConfig(n));
  const activeSprint = allSprintConfigs.find((s) => s.id === activeWeek);

  const panelProps = {
    checkboxes: state.checkboxes,
    textAreas: state.textAreas,
    selects: state.selects,
    minWins: state.minWins,
    onCheckbox: setCheckbox,
    onTextarea: setTextarea,
    onSelect: setSelect,
    onMinWin: setMinWin,
  };

  const checkedDates = Object.keys(checkinLog).filter((k) => checkinLog[k]);
  const checkInProps = { checkedDates, onToggle };

  return (
    <>
      <div className="header">
        <Header
          syncStatus={syncStatus}
          gistConnected={!!gistToken && !!gistId}
          onOpenSettings={() => setShowSettings(true)}
        />
        <WeekTabs
          tabs={allTabs}
          activeWeek={activeWeek}
          onSwitch={setActiveWeek}
          onAddSprint={addNextSprint}
          nextSprintNumber={nextSprintNumber}
          deletableTabIds={deletableTabIds}
          onDeleteTab={deleteTab}
        />
      </div>
      <div className="main">
        {activeWeek === "rest" && <RestWeekPanel {...panelProps} />}
        {activeWeek === "sprint0" && (
          <Sprint0Panel
            {...panelProps}
            {...checkInProps}
            dailyTodos={dailyTodos}
            onAddDailyTodo={addDailyTodo}
            onToggleDailyTodo={toggleDailyTodo}
            onDeleteDailyTodo={deleteDailyTodo}
          />
        )}
        {activeSprint && (
          <SprintPanel
            config={activeSprint}
            {...panelProps}
            {...checkInProps}
            frictionEntries={frictionLogs[activeSprint.id] ?? []}
            onAddFriction={(entry) => addFrictionEntry(activeSprint.id, entry)}
            onDeleteFriction={(entryId) =>
              deleteFrictionEntry(activeSprint.id, entryId)
            }
            milestone={milestones[activeSprint.id] ?? null}
            onSetMilestone={(text) => setMilestone(activeSprint.id, text)}
            onCompleteMilestone={() => completeMilestone(activeSprint.id)}
            onDeferMilestone={() => deferMilestone(activeSprint.id)}
            onResetMilestone={() => resetMilestone(activeSprint.id)}
            dailyTodos={dailyTodos}
            onAddDailyTodo={addDailyTodo}
            onToggleDailyTodo={toggleDailyTodo}
            onDeleteDailyTodo={deleteDailyTodo}
          />
        )}
      </div>

      {showSettings && (
        <GistSettings
          syncStatus={syncStatus}
          syncError={syncError}
          gistToken={gistToken}
          gistId={gistId}
          onConnect={handleGistConnect}
          onDisconnect={handleGistDisconnect}
          onLoadFromGist={handleLoadFromGist}
          getCurrentData={getCurrentData}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
