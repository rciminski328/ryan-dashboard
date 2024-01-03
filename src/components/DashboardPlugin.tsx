import { Grid, makeStyles } from "@material-ui/core";
import RefrigeratorStatus from "../features/refrigeratorStatus/components/RefrigeratorStatus";
import IndoorAirQuality from "../features/storeStatus/components/IndoorAirQuality";

const usePluginStyles = makeStyles((theme) => ({
  plugin: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
}));

export default function DashboardPlugin() {
  // dev refrigerator
  // const refrigeratorAssetId = "628aef25-734f-4075-8d0d-2150ed842406";
  // production refrigerator
  const refrigeratorAssetId = "3d0b744b-8b83-4767-9cb3-9f394caf70b6";
  // dev store
  // const storeAssetId = "f47fa820-6005-410b-88b3-652f7c8bc7eb";
  // production store
  const storeAssetId = "31913feb-50ba-46bb-90cc-f17d94bcffe4";

  const classes = usePluginStyles();

  return (
    <Grid container className={classes.plugin} spacing={1}>
      <Grid item lg={3} xs={9}>
        <IndoorAirQuality assetId={storeAssetId} />
      </Grid>
      <Grid item lg={9} xs={12}>
        <RefrigeratorStatus assetId={refrigeratorAssetId} />
      </Grid>
    </Grid>
  );
}
