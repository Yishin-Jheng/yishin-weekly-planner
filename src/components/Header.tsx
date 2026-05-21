import type { SyncStatus } from "./GistSettings";

const statusIcon: Record<SyncStatus, string> = {
  idle: "☁️",
  syncing: "🔄",
  error: "⚠️",
  synced: "✅",
};

const statusTitle: Record<SyncStatus, string> = {
  idle: "尚未設定 Gist 同步",
  syncing: "同步中...",
  synced: "已同步至 Gist",
  error: "同步失敗，點擊查看",
};

interface Props {
  syncStatus: SyncStatus;
  gistConnected: boolean;
  onOpenSettings: () => void;
}

export default function Header({
  syncStatus,
  gistConnected,
  onOpenSettings,
}: Props) {
  const showStatus = gistConnected;

  return (
    <div className="header-top">
      <span className="header-title">🗓️ Weekly Planner</span>
      <span className="header-sub">Yi-Shin Jheng · 2026</span>
      <div className="header-milestone">
        <span className="milestone-chip">
          目標：Advanced React + TypeScript + 作品集翻新
        </span>
        <button
          className="gist-sync-btn"
          onClick={onOpenSettings}
          title={showStatus ? statusTitle[syncStatus] : "設定 Gist 同步"}
        >
          {showStatus ? (
            <>
              <span className={`gist-sync-icon--${syncStatus}`}>
                {statusIcon[syncStatus]}
              </span>
              Gist
            </>
          ) : (
            <>⚙️ Gist</>
          )}
        </button>
      </div>
    </div>
  );
}
