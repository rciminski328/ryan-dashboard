import {
  Asset,
  createFrontendAssetsQuery,
  fetchAssets,
} from '@clearblade/ia-mfe-core';
import { useMessaging } from '@clearblade/ia-mfe-react';
import { useEffect } from 'react';
import { QueryFunctionContext, useQuery, useQueryClient } from 'react-query';

export type RefrigeratorAsset = Omit<Asset['frontend'], 'custom_data'> & {
  custom_data: {
    temperature: number;
    humidity: number;
    isRunning: boolean;
    doorOpen: boolean;
  };
};

export const refrigeratorStatusQueryKeys = {
  byAsset: (params: { assetId: string }) =>
    [{ scope: 'refrigeratorStatus', params }] as const,
};

async function fetchRefrigeratorStatus({
  queryKey: [
    {
      params: { assetId },
    },
  ],
}: QueryFunctionContext<
  ReturnType<typeof refrigeratorStatusQueryKeys.byAsset>
>): Promise<RefrigeratorAsset> {
  const data = await fetchAssets(new AbortController(), {
    query: createFrontendAssetsQuery({
      Filters: [
        [{ type: 'default', operator: '=', field: 'id', value: assetId }],
      ],
    }),
  });

  const asset = data.DATA[0];
  if (typeof asset === 'undefined') {
    throw new Error(`No asset found with id '${assetId}'`);
  }

  return asset as unknown as RefrigeratorAsset;
}

/**
 * Represents the current status of a refrigerator asset
 */
export function useRefrigeratorStatusQuery({ assetId }: { assetId: string }) {
  const { subscribe, unsubscribe } = useMessaging();
  const queryClient = useQueryClient();
  useEffect(() => {
    const topics = [`_dbupdate/_monitor/_asset/${assetId}/locationAndStatus`];

    subscribe(topics, (msg) => {
      const assetData = msg.payload as RefrigeratorAsset;
      queryClient.setQueryData<RefrigeratorAsset>(
        refrigeratorStatusQueryKeys.byAsset({ assetId }),
        (data) => {
          if (typeof data === 'undefined') {
            return assetData;
          }

          return {
            ...data,
            last_updated: assetData.last_updated,
            custom_data: {
              ...data.custom_data,
              ...assetData.custom_data,
            },
          };
        }
      );
    });

    return () => unsubscribe(topics);
  }, [assetId, subscribe, unsubscribe]);

  return useQuery(refrigeratorStatusQueryKeys.byAsset({ assetId }), {
    queryFn: fetchRefrigeratorStatus,
    refetchOnMount: false,
  });
}
