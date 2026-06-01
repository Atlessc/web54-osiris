import type { LocalConfigMap, LocalConfigName } from "@/types/local-config";

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