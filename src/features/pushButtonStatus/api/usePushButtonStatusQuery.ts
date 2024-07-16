import { useQuery } from "react-query";
import { getPlatformInfo } from "../../EM300 TempHumidity/utils/getPlatformInfo.tsx/getPlatformInfo";
import { getAuthInfo } from "../../../utils/authInfo";

interface PushButtonStatusResponse {
  currentStatus: boolean;
  x: string[];
  y: number[];
}

async function fetchPushButtonStatus(
  assetId: string
): Promise<PushButtonStatusResponse> {
  const authInfo = getAuthInfo();
  const response = await fetch(
    `${getPlatformInfo().url}/api/v/1/code/${
      authInfo.systemKey
    }/fetchPushButtonStatus`,
    {
      method: "POST",
      headers: {
        "ClearBlade-UserToken": authInfo.userToken,
      },
      body: JSON.stringify({ assetId }),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data: PushButtonStatusResponse = await response.json();
  return data;
}

export function usePushButtonStatusQuery({ assetId }: { assetId: string }) {
  return useQuery(["pushButtonStatus", assetId], () =>
    fetchPushButtonStatus(assetId)
  );
}
