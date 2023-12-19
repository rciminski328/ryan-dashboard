import {
  Box,
  Card,
  Grid,
  Theme,
  Typography,
  makeStyles,
} from "@material-ui/core";
import TemperatureCharts from "./TemperatureCharts";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import {
  RefrigeratorAsset,
  refrigeratorStatusQueryKeys,
  useRefrigeratorStatusQuery,
} from "../api/refrigeratorStatus";
import HumidityCharts from "./HumidityCharts";
import DoorCharts from "./DoorCharts";
import {
  // @ts-ignore
  RelativeAbsoluteDateRangePicker,
  useMessaging,
} from "@clearblade/ia-mfe-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import {
  doorOpenHistoryQueryKeys,
  useDoorOpenHistoryQuery,
} from "../api/doorOpenHistory";
import {
  humidityHistoryQueryKeys,
  useHumidityHistoryQuery,
} from "../api/humidityHistory";
import {
  temperatureHistoryQueryKeys,
  useTemperatureHistoryQuery,
} from "../api/temperatureHistory";
import { Skeleton } from "@material-ui/lab";

const refrigeratorStatusStyles = makeStyles<Theme, { status: boolean }>(
  (theme) => ({
    statusIcon: ({ status }) => ({
      color: status ? theme.palette.success.main : theme.palette.text.disabled,
    }),
  })
);

export default function RefrigeratorStatus({ assetId }: { assetId: string }) {
  const refrigeratorStatusQuery = useRefrigeratorStatusQuery({ assetId });

  const temperatureHistoryQuery = useTemperatureHistoryQuery({
    assetId,
  });
  const humidityHistoryQuery = useHumidityHistoryQuery({
    assetId,
  });
  const doorOpenHistoryQuery = useDoorOpenHistoryQuery({
    assetId,
  });
  useLiveDataForRefrigerator({ assetId });

  const status = refrigeratorStatusQuery.data?.custom_data.isRunning;
  const classes = refrigeratorStatusStyles({ status });
  const [timeRange, setTimeRange] = useState({
    type: "relative",
    count: 1,
    units: 86400,
  });

  if (
    refrigeratorStatusQuery.isLoading ||
    temperatureHistoryQuery.isLoading ||
    humidityHistoryQuery.isLoading ||
    doorOpenHistoryQuery.isLoading
  ) {
    return (
      <>
        <Skeleton variant="rect" height={25} />
        <Box pt={1} />
        <Skeleton variant="rect" height={200} />
        <Box pt={2} />
        <Skeleton variant="rect" height={200} />
        <Box pt={2} />
        <Skeleton variant="rect" height={200} />
      </>
    );
  }

  if (
    refrigeratorStatusQuery.isError ||
    temperatureHistoryQuery.isError ||
    humidityHistoryQuery.isError ||
    doorOpenHistoryQuery.isError
  ) {
    return <div>Error</div>;
  }

  return (
    <Card>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        spacing={2}
      >
        <Grid
          container
          item
          spacing={2}
          wrap="nowrap"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h5" noWrap>
              Refrigerator Status
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" flexWrap="nowrap" alignItems="center">
              <FiberManualRecordIcon className={classes.statusIcon} />
              <Typography variant="subtitle1">
                {status ? "On" : "Off"}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <RelativeAbsoluteDateRangePicker
              currentRange={timeRange}
              onApplyRange={setTimeRange}
              compact
            />
          </Grid>
        </Grid>

        <TemperatureCharts
          assetId={assetId}
          current={refrigeratorStatusQuery.data.custom_data.temperature}
        />
        <HumidityCharts
          assetId={assetId}
          current={refrigeratorStatusQuery.data.custom_data.humidity}
        />
        <DoorCharts
          assetId={assetId}
          current={refrigeratorStatusQuery.data.custom_data.doorOpen}
        />
      </Grid>
    </Card>
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
