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
import { RelativeOrAbsoluteRange, TimeUnitMultiplier } from "../utils/types";

const refrigeratorStatusStyles = makeStyles<Theme, { status: boolean }>(
  (theme) => ({
    statusIcon: ({ status }) => ({
      color: status ? theme.palette.success.main : theme.palette.text.disabled,
    }),
  })
);

export default function RefrigeratorStatus({ assetId }: { assetId: string }) {
  const refrigeratorStatusQuery = useRefrigeratorStatusQuery({ assetId });

  const [timeRange, setTimeRange] = useState<RelativeOrAbsoluteRange>({
    type: "relative",
    count: 1,
    units: TimeUnitMultiplier.DAYS,
  });

  const temperatureHistoryQuery = useTemperatureHistoryQuery({
    assetId,
    timeRange,
  });
  const humidityHistoryQuery = useHumidityHistoryQuery({
    assetId,
    timeRange,
  });
  const doorOpenHistoryQuery = useDoorOpenHistoryQuery({
    timeRange,
    assetId,
  });
  useLiveDataForRefrigerator({ assetId, timeRange });

  const status = refrigeratorStatusQuery.data?.custom_data.isRunning;
  const classes = refrigeratorStatusStyles({ status: status ?? false });

  if (refrigeratorStatusQuery.isLoading) {
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

  if (!refrigeratorStatusQuery.isSuccess) {
    return null;
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
            <Box pt={1}>
              <RelativeAbsoluteDateRangePicker
                currentRange={timeRange}
                onApplyRange={(range) => {
                  if (range) {
                    setTimeRange(range);
                  }
                }}
                compact
              />
            </Box>
          </Grid>
        </Grid>

        <TemperatureCharts
          temperatureHistoryQuery={temperatureHistoryQuery}
          current={refrigeratorStatusQuery.data.custom_data.temperature}
        />
        <HumidityCharts
          humidityHistoryQuery={humidityHistoryQuery}
          current={refrigeratorStatusQuery.data.custom_data.humidity}
        />
        <DoorCharts
          doorOpenHistoryQuery={doorOpenHistoryQuery}
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

function useLiveDataForRefrigerator({
  assetId,
  timeRange,
}: {
  assetId: string;
  timeRange: RelativeOrAbsoluteRange;
}) {
  const { subscribe, unsubscribe } = useMessaging();
  const queryClient = useQueryClient();
  useEffect(() => {
    const topics = [`_dbupdate/_monitor/_asset/${assetId}/locationAndStatus`];

    subscribe(topics, (msg) => {
      try {
        const assetData = msg.payload as RefrigeratorAsset;
        const last_updated = assetData.last_updated;
        if (last_updated === null) {
          console.warn(
            `Received message from on ${msg.message.destinationName} that contained a null value for last_updated. Ignoring`
          );
          return;
        }
        queryClient.setQueryData<RefrigeratorAsset | undefined>(
          refrigeratorStatusQueryKeys.byAsset({ assetId }),
          (data) => {
            if (typeof data === "undefined") {
              return assetData;
            }

            return {
              ...data,
              last_updated: last_updated,
              custom_data: {
                ...data.custom_data,
                ...assetData.custom_data,
              },
            };
          }
        );

        if (
          typeof assetData.custom_data.temperature !== "undefined" &&
          !queryClient.isFetching({
            queryKey: temperatureHistoryQueryKeys.byAsset({
              assetId,
              timeRange,
            }),
          })
        ) {
          queryClient.setQueryData<HistoricalData | undefined>(
            temperatureHistoryQueryKeys.byAsset({ assetId, timeRange }),
            (data) => {
              if (typeof data === "undefined") {
                return data;
              }
              return {
                ...data,
                x: [...data.x, last_updated],
                y: [...data.y, assetData.custom_data.temperature],
              };
            }
          );
        }

        if (
          typeof assetData.custom_data.humidity !== "undefined" &&
          !queryClient.isFetching({
            queryKey: humidityHistoryQueryKeys.byAsset({ assetId, timeRange }),
          })
        ) {
          queryClient.setQueryData<HistoricalData | undefined>(
            humidityHistoryQueryKeys.byAsset({ assetId, timeRange }),
            (data) => {
              if (typeof data === "undefined") {
                return data;
              }
              return {
                ...data,
                x: [...data.x, last_updated],
                y: [...data.y, assetData.custom_data.humidity],
              };
            }
          );
        }

        if (
          typeof assetData.custom_data.doorOpen !== "undefined" &&
          !queryClient.isFetching({
            queryKey: doorOpenHistoryQueryKeys.byAsset({ assetId, timeRange }),
          })
        ) {
          queryClient.setQueryData<HistoricalData | undefined>(
            doorOpenHistoryQueryKeys.byAsset({ assetId, timeRange }),
            (data) => {
              if (typeof data === "undefined") {
                return data;
              }
              return {
                ...data,
                x: [...data.x, last_updated],
                y: [...data.y, assetData.custom_data.doorOpen === true ? 1 : 0],
              };
            }
          );
        }
      } catch (e) {
        console.error("caught error!", e);
      }
    });

    return () => unsubscribe(topics);
  }, [assetId, subscribe, unsubscribe, queryClient, timeRange]);
}
