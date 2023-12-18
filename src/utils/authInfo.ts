interface AuthInfo {
  systemKey: string;
  userToken: string;
}

export function getAuthInfo(): AuthInfo {
  const authInfo: { "rad-demo": AuthInfo } = JSON.parse(
    localStorage.getItem("asset_monitor_auth_info")
  );
  const radDemoAuthInfo = authInfo["rad-demo"];
  if (typeof radDemoAuthInfo === "undefined") {
    throw new Error("rad-demo auth info not found");
  }
  return authInfo["rad-demo"];
}
