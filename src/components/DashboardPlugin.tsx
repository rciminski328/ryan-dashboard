import { useEffect } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { useStoreStatusQuery } from "../features/storeStatus/api/storeStatus";
import {
  doorOpenHistoryQueryKeys,
  useDoorOpenHistoryQuery,
} from "../features/refrigeratorStatus/api/doorOpenHistory";
import {
  humidityHistoryQueryKeys,
  useHumidityHistoryQuery,
} from "../features/refrigeratorStatus/api/humidityHistory";
import {
  RefrigeratorAsset,
  refrigeratorStatusQueryKeys,
  useRefrigeratorStatusQuery,
} from "../features/refrigeratorStatus/api/refrigeratorStatus";
import {
  temperatureHistoryQueryKeys,
  useTemperatureHistoryQuery,
} from "../features/refrigeratorStatus/api/temperatureHistory";
import { Skeleton } from "@material-ui/lab";
import RefrigeratorStatus from "../features/refrigeratorStatus/components/RefrigeratorStatus";
import { useMessaging } from "@clearblade/ia-mfe-react";
import { useQueryClient } from "react-query";
import IndoorAirQuality from "../features/storeStatus/components/IndoorAirQuality";

const usePluginStyles = makeStyles((theme) => ({
  plugin: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
}));

export default function DashboardPlugin() {
  // dev refrigerator
  const refrigeratorAssetId = "628aef25-734f-4075-8d0d-2150ed842406";
  // production refrigerator
  // const refrigeratorAssetId = "3d0b744b-8b83-4767-9cb3-9f394caf70b6";
  // dev store
  const storeAssetId = "f47fa820-6005-410b-88b3-652f7c8bc7eb";
  // production store
  // const storeAssetId = "31913feb-50ba-46bb-90cc-f17d94bcffe4"

  const indoorEnvironmentStatusQuery = useStoreStatusQuery({
    assetId: storeAssetId,
  });
  const refrigeratorStatusQuery = useRefrigeratorStatusQuery({
    assetId: refrigeratorAssetId,
  });
  const temperatureHistoryQuery = useTemperatureHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  const humidityHistoryQuery = useHumidityHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  const doorOpenHistoryQuery = useDoorOpenHistoryQuery({
    assetId: refrigeratorAssetId,
  });
  useLiveDataForRefrigerator({ assetId: refrigeratorAssetId });
  const classes = usePluginStyles();
  if (
    indoorEnvironmentStatusQuery.isLoading ||
    refrigeratorStatusQuery.isLoading ||
    temperatureHistoryQuery.isLoading ||
    humidityHistoryQuery.isLoading ||
    doorOpenHistoryQuery.isLoading
  )
    return <Skeleton />;
  if (
    indoorEnvironmentStatusQuery.isError ||
    refrigeratorStatusQuery.isError ||
    temperatureHistoryQuery.isError ||
    humidityHistoryQuery.isError ||
    doorOpenHistoryQuery.isError
  )
    return <div>Error</div>;

  return (
    <Grid container className={classes.plugin} spacing={1}>
      <Grid item xs={3}>
        <IndoorAirQuality assetId={storeAssetId} />
      </Grid>
      <Grid item xs={9}>
        <RefrigeratorStatus assetId={refrigeratorAssetId} />
      </Grid>
    </Grid>
  );
}

interface HistoricalData {
  x: string[];
  y: number[];
}

function useLiveDataForRefrigerator({ assetId }: { assetId: string }) {
  const { subscribe, unsubscribe } = useMessaging();
  const queryClient = useQueryClient();
  useEffect(() => {
    const topics = [`_dbupdate/_monitor/_asset/${assetId}/locationAndStatus`];

    subscribe(topics, (msg) => {
      const assetData = msg.payload as RefrigeratorAsset;
      queryClient.setQueryData<RefrigeratorAsset>(
        refrigeratorStatusQueryKeys.byAsset({ assetId }),
        (data) => {
          if (typeof data === "undefined") {
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

      if (typeof assetData.custom_data.temperature !== "undefined") {
        queryClient.setQueryData<HistoricalData>(
          temperatureHistoryQueryKeys.byAsset({ assetId }),
          (data) => {
            return {
              ...data,
              x: [...data.x, assetData.last_updated],
              y: [...data.y, assetData.custom_data.temperature],
            };
          }
        );
      }

      if (typeof assetData.custom_data.humidity !== "undefined") {
        queryClient.setQueryData<HistoricalData>(
          humidityHistoryQueryKeys.byAsset({ assetId }),
          (data) => {
            return {
              ...data,
              x: [...data.x, assetData.last_updated],
              y: [...data.y, assetData.custom_data.humidity],
            };
          }
        );
      }

      if (typeof assetData.custom_data.doorOpen !== "undefined") {
        queryClient.setQueryData<HistoricalData>(
          doorOpenHistoryQueryKeys.byAsset({ assetId }),
          (data) => {
            return {
              ...data,
              x: [...data.x, assetData.last_updated],
              y: [...data.y, assetData.custom_data.doorOpen === true ? 1 : 0],
            };
          }
        );
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, subscribe, unsubscribe, queryClient]);
}
