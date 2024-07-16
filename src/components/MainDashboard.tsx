import React, { useEffect } from 'react';
import { Box, Card, Grid, Typography, makeStyles } from '@material-ui/core';
import RefrigeratorStatus from '../features/refrigeratorStatus/components/RefrigeratorStatus';

const usePluginStyles = makeStyles((theme) => ({
  plugin: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  card: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

interface DashboardPluginProps {
  refrigeratorAssetId: string;
}

const DashboardPlugin: React.FC<DashboardPluginProps> = ({ refrigeratorAssetId }) => {
  const classes = usePluginStyles();

  useEffect(() => {
    const elem = document.createElement('link');
    elem.setAttribute('href', 'https://db.onlinewebfonts.com/c/fa619a1b284957d9e6469c5cd6c717c4?family=ATT+Aleck+Sans+Medium+Regular');
    elem.setAttribute('rel', 'stylesheet');
    document.getElementsByTagName('head')[0].appendChild(elem);
  }, []);

  return (
    <Grid container direction="column" className={classes.plugin} spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.card}>
          <Box>
            <Typography color="secondary" variant="h5">
              Refrigerator Power Status
            </Typography>
            <RefrigeratorStatus assetId={refrigeratorAssetId} />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardPlugin;
