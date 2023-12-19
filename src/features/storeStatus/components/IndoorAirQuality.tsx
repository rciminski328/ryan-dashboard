import { Box, Card, Grid, Typography, makeStyles } from "@material-ui/core";
import GaugeChart from "./GaugeChart";
import { useStoreStatusQuery } from "../api/storeStatus";
import { gaugeChartHeight } from "../../../utils";
import { Skeleton } from "@material-ui/lab";

const useIndoorAirQualityStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    height: gaugeChartHeight,
  },
}));

export default function IndoorAirQuality({ assetId }: { assetId: string }) {
  const storeStatusQuery = useStoreStatusQuery({
    assetId,
  });
  const classes = useIndoorAirQualityStyles();

  if (storeStatusQuery.isLoading) {
    return (
      <>
        <Skeleton variant="rect" height={25} />
        <Box pt={1} />
        <Skeleton variant="rect" height={150} />
        <Box pt={2} />
        <Skeleton variant="rect" height={150} />
        <Box pt={2} />
        <Skeleton variant="rect" height={150} />
      </>
    );
  }

  if (storeStatusQuery.isError) {
    return <div>Error</div>;
  }

  return (
    <Card>
      <Box textAlign={"center"} mb={2}>
        <Typography variant="h5">Indoor Air Quality</Typography>
      </Box>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        className={classes.container}
        wrap="nowrap"
      >
        <Grid item className={classes.section}>
          <GaugeChart
            title="Temperature"
            units="°F"
            value={storeStatusQuery.data.custom_data.temperature}
          />
        </Grid>
        <Grid item className={classes.section}>
          <GaugeChart
            title="Humidity"
            units="%"
            value={storeStatusQuery.data.custom_data.humidity}
          />
        </Grid>
        <Grid item className={classes.section}>
          <GaugeChart
            title="CO2"
            units=" PPM"
            value={storeStatusQuery.data.custom_data.co2}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
