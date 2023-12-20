interface AuthInfo {
  systemKey: string;
  userToken: string;
}

export function getAuthInfo(): AuthInfo {
  const localStorageItem = localStorage.getItem("asset_monitor_auth_info");
  if (localStorageItem === null) {
    throw new Error("Could not find asset_monitor_auth_info in local storage");
  }
  const authInfo: { "rad-demo": AuthInfo } = JSON.parse(localStorageItem);
  const radDemoAuthInfo = authInfo["rad-demo"];
  if (typeof radDemoAuthInfo === "undefined") {
    throw new Error("rad-demo auth info not found");
  }
  return authInfo["rad-demo"];
}
