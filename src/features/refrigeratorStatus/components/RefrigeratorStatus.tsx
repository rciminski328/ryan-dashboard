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
import { useRefrigeratorStatusQuery } from "../api/refrigeratorStatus";
import HumidityCharts from "./HumidityCharts";
import DoorCharts from "./DoorCharts";
import {
  // @ts-ignore
  RelativeAbsoluteDateRangePicker,
} from "@clearblade/ia-mfe-react";
import { useState } from "react";

const refrigeratorStatusStyles = makeStyles<Theme, { status: boolean }>(
  (theme) => ({
    statusIcon: ({ status }) => ({
      color: status ? theme.palette.success.main : theme.palette.text.disabled,
    }),
  })
);

export default function RefrigeratorStatus({ assetId }: { assetId: string }) {
  const { data } = useRefrigeratorStatusQuery({ assetId });
  const status = data.custom_data.isRunning;
  const classes = refrigeratorStatusStyles({ status });
  const [timeRange, setTimeRange] = useState({
    type: "relative",
    count: 1,
    units: 86400,
  });

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
            />
          </Grid>
        </Grid>

        <TemperatureCharts
          assetId={assetId}
          current={data.custom_data.temperature}
        />
        <HumidityCharts assetId={assetId} current={data.custom_data.humidity} />
        <DoorCharts assetId={assetId} current={data.custom_data.doorOpen} />
      </Grid>
    </Card>
  );
}
