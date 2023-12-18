interface PlatformInfo {
  url: string;
}

export function getPlatformInfo(): PlatformInfo {
  const platformInfo: PlatformInfo = JSON.parse(
    localStorage.getItem("asset_monitor_platform_info")
  );
  return platformInfo;
}
