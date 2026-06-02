import type {
  ConfigStatusResponse,
  LocalConfigMap,
  LocalConfigName,
} from "@/types/local-config";

export async function getLocalConfig<TConfigName extends LocalConfigName>(
  configName: TConfigName,
): Promise<LocalConfigMap[TConfigName]> {
  const response = await fetch(`/api/local-config/${configName}`, {
    cache: "no-store",
  });

  const payload = await response.json();

  if (!payload.ok) {
    throw new Error(payload.error ?? `Failed to load ${configName}`);
  }

  return payload.config as LocalConfigMap[TConfigName];
}

export async function getLocalConfigStatus(): Promise<ConfigStatusResponse> {
  const response = await fetch("/api/local-config/status", {
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to load local config status");
  }

  return payload as ConfigStatusResponse;
}

export async function updateLocalConfig<TConfigName extends LocalConfigName>(
  configName: TConfigName,
  config: LocalConfigMap[TConfigName],
): Promise<LocalConfigMap[TConfigName]> {
  const response = await fetch(`/api/local-config/${configName}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ config }),
  });

  const payload = await response.json();

  if (!payload.ok) {
    throw new Error(payload.error ?? `Failed to update ${configName}`);
  }

  return payload.config as LocalConfigMap[TConfigName];
}

export interface LocalConfigExportBundle {
  ok: true;
  exportedAt: string;
  version: number;
  type: "osiris-local-config-export";
  configs: LocalConfigMap;
}

export interface LocalConfigImportResponse {
  ok: boolean;
  imported: LocalConfigName[];
  importedAt: string;
  error?: string;
}

export async function exportLocalConfigBundle(): Promise<LocalConfigExportBundle> {
  const response = await fetch("/api/local-config/export", {
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? "Failed to export local config");
  }

  return payload as LocalConfigExportBundle;
}

export async function importLocalConfigBundle(
  bundle: unknown,
): Promise<LocalConfigImportResponse> {
  const response = await fetch("/api/local-config/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(bundle),
  });

  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? "Failed to import local config");
  }

  return payload as LocalConfigImportResponse;
}

export interface SourceHealthItem {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
  status: "online" | "warning" | "offline";
  httpStatus: number | null;
  responseTimeMs: number | null;
  checkedAt: string;
  error: string | null;
}

export interface SourceHealthResponse {
  ok: boolean;
  checkedAt: string;
  summary: {
    total: number;
    online: number;
    warning: number;
    offline: number;
    failedSourceCount: number;
  };
  sources: SourceHealthItem[];
  error?: string;
}

export async function getSourceHealth(): Promise<SourceHealthResponse> {
  const response = await fetch("/api/source-health", {
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to load source health");
  }

  return payload as SourceHealthResponse;
}