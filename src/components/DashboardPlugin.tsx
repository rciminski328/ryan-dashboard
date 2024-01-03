import { Box, Card, Grid, Typography, makeStyles } from "@material-ui/core";
import RefrigeratorStatus from "../features/refrigeratorStatus/components/RefrigeratorStatus";
import IndoorAirQuality from "../features/storeStatus/components/IndoorAirQuality";
import { useEffect } from "react";

const usePluginStyles = makeStyles((theme) => ({
  plugin: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
  card: {
    height: "100%",
    display: "flex",
    alignItems: "center",
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

  useEffect(() => {
    const elem = document.createElement("link");
    elem.setAttribute(
      "href",
      "https://db.onlinewebfonts.com/c/fa619a1b284957d9e6469c5cd6c717c4?family=ATT+Aleck+Sans+Medium+Regular"
    );
    elem.setAttribute("rel", "stylesheet");

    document.getElementsByTagName("head")[0].appendChild(elem);
  }, []);

  return (
    <Grid container className={classes.plugin} spacing={1}>
      <Grid container item lg={3} xs={9} spacing={1}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <Box p={2}>
              <Typography color="secondary" variant="h5">
                Get equipment insights, improve operations and reduce costs by
                connecting all your remote assets to a single platform via web
                or app
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <IndoorAirQuality assetId={storeAssetId} />
        </Grid>
      </Grid>
      <Grid item lg={9} xs={12}>
        <RefrigeratorStatus assetId={refrigeratorAssetId} />
      </Grid>
    </Grid>
  );
}
