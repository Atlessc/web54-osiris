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