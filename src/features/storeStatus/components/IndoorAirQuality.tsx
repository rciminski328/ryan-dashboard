import { Card, Grid, makeStyles } from "@material-ui/core";
import GaugeChart from "./GaugeChart";
import { useStoreStatusQuery } from "../api/storeStatus";
import { gaugeChartHeight } from "../../../utils";

const useIndoorAirQualityStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  section: {
    border: `1px solid ${theme.palette.divider}`,
    height: gaugeChartHeight,
  },
}));

export default function IndoorAirQuality({ assetId }: { assetId: string }) {
  const { data } = useStoreStatusQuery({
    assetId,
  });
  const classes = useIndoorAirQualityStyles();
  return (
    <Card>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        className={classes.container}
        wrap="nowrap"
      >
        <Grid item className={classes.section}>
          <GaugeChart
            title="Temperature"
            units="F"
            value={data.custom_data.temperature}
          />
        </Grid>
        <Grid item className={classes.section}>
          <GaugeChart
            title="Humidity"
            units="%"
            value={data.custom_data.humidity}
          />
        </Grid>
        <Grid item className={classes.section}>
          <GaugeChart title="CO2" units="PPM" value={data.custom_data.co2} />
        </Grid>
      </Grid>
    </Card>
  );
}
