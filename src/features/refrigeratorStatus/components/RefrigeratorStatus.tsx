import { AssetType } from '@clearblade/ia-mfe-core';
import {
  Box,
  Card,
  Grid,
  Switch,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import TemperatureCharts from './TemperatureCharts';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useRefrigeratorStatusQuery } from '../api/refrigeratorStatus';
import HumidityCharts from './HumidityCharts';
import DoorCharts from './DoorCharts';

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

  return (
    <Card>
      <Grid
        container
        alignItems='center'
        justifyContent='center'
        direction='column'
        spacing={2}
      >
        <Grid
          container
          item
          spacing={2}
          wrap='nowrap'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item>
            <Typography variant='h6' noWrap>
              Refrigerator Status
            </Typography>
          </Grid>
          <Grid item>
            <Box display='flex' flexWrap='nowrap' alignItems='center'>
              <FiberManualRecordIcon className={classes.statusIcon} />
              <Typography variant='body2'>{status ? 'On' : 'Off'}</Typography>
            </Box>
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
