import { useState } from "react";
import { verifyToken, createGist, fetchFromGist, GIST_TOKEN_KEY, GIST_ID_KEY } from "../utils/gistSync";
import type { GistData } from "../utils/gistSync";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface Props {
  syncStatus: SyncStatus;
  syncError: string | null;
  gistToken: string;
  gistId: string;
  onConnect: (token: string, gistId: string) => void;
  onDisconnect: () => void;
  onLoadFromGist: (data: GistData) => void;
  getCurrentData: () => GistData;
  onClose: () => void;
}

export default function GistSettings({
  syncStatus,
  syncError,
  gistToken,
  gistId,
  onConnect,
  onDisconnect,
  onLoadFromGist,
  getCurrentData,
  onClose,
}: Props) {
  const [tokenInput, setTokenInput] = useState(gistToken);
  const [gistIdInput, setGistIdInput] = useState(gistId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!gistToken && !!gistId;

  async function handleConnect() {
    const token = tokenInput.trim();
    const existingGistId = gistIdInput.trim();

    if (!token) {
      setError("請輸入 GitHub Token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const valid = await verifyToken(token);
      if (!valid) {
        setError("Token 無效，請確認權限是否包含 gist");
        return;
      }

      let resolvedGistId = existingGistId;

      if (existingGistId) {
        const data = await fetchFromGist(token, existingGistId);
        localStorage.setItem(GIST_TOKEN_KEY, token);
        localStorage.setItem(GIST_ID_KEY, existingGistId);
        onConnect(token, existingGistId);
        onLoadFromGist(data);
      } else {
        const currentData = getCurrentData();
        resolvedGistId = await createGist(token, currentData);
        localStorage.setItem(GIST_TOKEN_KEY, token);
        localStorage.setItem(GIST_ID_KEY, resolvedGistId);
        onConnect(token, resolvedGistId);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "連接失敗");
    } finally {
      setLoading(false);
    }
  }

  function handleDisconnect() {
    localStorage.removeItem(GIST_TOKEN_KEY);
    localStorage.removeItem(GIST_ID_KEY);
    onDisconnect();
    onClose();
  }

  const statusLabel: Record<SyncStatus, string> = {
    idle: "尚未同步",
    syncing: "同步中...",
    synced: "已同步",
    error: "同步失敗",
  };

  return (
    <div
      className="gist-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gist-backdrop" onClick={onClose} />
      <div className="gist-modal" onClick={(e) => e.stopPropagation()}>
        <button className="gist-close-btn" onClick={onClose}>×</button>

        <h2 className="gist-title">GitHub Gist 同步設定</h2>
        <p className="gist-subtitle">
          資料將自動同步至你的私人 Gist，換裝置時不會遺失。
        </p>

        {isConnected ? (
          <div className="gist-form">
            <div className="gist-status-row">
              <span className="gist-status-label">狀態</span>
              <span className={`gist-status-value gist-status-value--${syncStatus}`}>
                {statusLabel[syncStatus]}
              </span>
            </div>

            {syncError && <p className="gist-error-msg">{syncError}</p>}

            <div className="gist-id-display">Gist ID：{gistId}</div>

            <div className="gist-hint">Token 已儲存於 localStorage（僅存在本機）</div>

            <button className="gist-disconnect-btn" onClick={handleDisconnect}>
              中斷連接
            </button>
          </div>
        ) : (
          <div className="gist-form">
            <div className="gist-field">
              <label className="gist-label">GitHub Personal Access Token</label>
              <input
                type="password"
                className="gist-input"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
              <p className="gist-input-hint">
                需要使用 <strong>Classic Token</strong>（Fine-grained PAT 不支援 Gist）。
                在 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) 產生，勾選 <code>gist</code> 權限。
              </p>
            </div>

            <div className="gist-field">
              <label className="gist-label">現有 Gist ID（選填）</label>
              <input
                type="text"
                className="gist-input"
                placeholder="留空則自動建立新的 Gist"
                value={gistIdInput}
                onChange={(e) => setGistIdInput(e.target.value)}
              />
              <p className="gist-input-hint">
                換裝置時輸入原本的 Gist ID，可載入舊資料。
              </p>
            </div>

            {error && <p className="gist-error-msg">{error}</p>}

            <button
              className="gist-connect-btn"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? "連接中..." : "連接 GitHub Gist"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
