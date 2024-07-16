interface AuthInfo {
  systemKey: 'a8ddffe80cb2e3bb87dda0a28034';
  userToken: 'A8DDFFE80CBCB1C8E7D8B0F1F56A';
}

export function getAuthInfo(): AuthInfo {
  const localStorageItem = localStorage.getItem("asset_monitor_auth_info");
  if (localStorageItem === null) {
    throw new Error("Could not find asset_monitor_auth_info in local storage");
  }
  const authInfo: { "ia-ia-clearblade_test1016": AuthInfo } = JSON.parse(localStorageItem);
  const radDemoAuthInfo = authInfo["ia-ia-clearblade_test1016"];
  if (typeof radDemoAuthInfo === "undefined") {
    throw new Error("rad-demo auth info not found");
  }
  return authInfo["ia-ia-clearblade_test1016"];
}
